import { NotificationEvents } from "../../../../Domain/enums/notification";
import { CandidateTestStatus, TestStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { ITokenService } from "../../../interface/service/ITokenService";
import { CompanyPublishTestInputDTO, CompanyCreateTestOutputDTO } from "../../dtos/test/company.createTest.dto";
import { ICompanyPublishTestUsecase } from "../../interfaces/test/ICompany.publishTest.usecase";

export class CompanyPublishTestUsecase implements ICompanyPublishTestUsecase {
    constructor(
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _jobRoleRepository: IJobRepository,
        private _tokenService: ITokenService,
        private _processNotificationUsecase: IAdminProcessNotificationUsecase,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: CompanyPublishTestInputDTO): Promise<CompanyCreateTestOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const subscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const plan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        const candidateLimit = plan.maxCandidates

        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(test.companyId !== company.id){
            throw new AppError(TestMessages.error.NOT_ALLOWED, statusCode.FORBIDDEN)
        }
        if(test.testStatus !== TestStatus.DRAFT) {
            throw new AppError(TestMessages.error.NOT_DRAFTED_TEST, statusCode.BAD_REQUEST)
        }

        if(test.startTime < new Date()){
            throw new AppError(TestMessages.error.INVALID_START_TIME, statusCode.BAD_REQUEST)
        }
        if(test.startTime >= test.endTime) {
            throw new AppError(TestMessages.error.INVALID_END_TIME, statusCode.BAD_REQUEST)
        }

        if(!test.questions || test.questions.length === 0){
            throw new AppError(TestMessages.error.QUESTIONS_REQUIRED, statusCode.BAD_REQUEST)
        }

        const candidates = await this._testCandidateRepository.findByTestId(test.id)

        if(!candidates || candidates.length === 0){
            throw new AppError(TestMessages.error.CANDIDATES_REQUIRED, statusCode.BAD_REQUEST)
        }
        if( candidateLimit != null && candidates.length > candidateLimit){
            throw new AppError(TestMessages.error.TEST_CANDIDATES_COUNT_EXCEEDED, statusCode.BAD_REQUEST)
        }
        
        const jobRole = await this._jobRoleRepository.findById(test.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(jobRole.createdById !== company.id){
            throw new AppError(TestMessages.error.JOBROLE_IS_NOT_OWN, statusCode.BAD_REQUEST)
        }
        const activeTest = await this._testRepository.findByJobroleId(jobRole.id, company.id)
        if(activeTest){
            throw new AppError(TestMessages.error.CANNOT_CREATE_TEST_FOR_THIS_ROLE, statusCode.BAD_REQUEST)
        }
    
        const savedCandidatesWithLinks = await Promise.all(
            candidates.map( async (candidate) => {
                const token = this._tokenService.generateTestToken()
                candidate.testToken = token
                candidate.candidateTestStatus = CandidateTestStatus.INVITED

                const savedCandidate = await this._testCandidateRepository.update(candidate.id, candidate)
                const testLink = `http://localhost:5173/candidate/test/${token}`

                return {
                    candidate: savedCandidate,
                    testLink
                }
            })
        )
        test.testStatus = TestStatus.PUBLISHED
        const savedTest = await this._testRepository.update(test.id, test)

        if(!savedTest){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        await Promise.all(
            savedCandidatesWithLinks.map(({candidate, testLink}) => {
                return this._processNotificationUsecase.execute({
                    event: NotificationEvents.TEST_INVITE,
                    recipients: [{
                        recipientId: candidate?.id,
                        recipientType: userRole.Candidate,
                        email: candidate?.email
                    }],
                    variables: {
                        companyName: company.getName(),
                        testName: savedTest.name,
                        role: jobRole.name,
                        testLink: testLink,
                        startTime: savedTest.startTime.toLocaleString(),
                        endTime: savedTest.endTime.toLocaleString(),
                        instructions: [
                            "Do not switch tabs.",
                            "Do not copy or paste.",
                            "Stay in full screen mode.",
                            "The test will auto-submit when time ends.",
                            "Answers are auto-saved."
                        ].join("\n")
                    }
                })
            })
        )

        return {
            test: savedTest
        }
    }
}