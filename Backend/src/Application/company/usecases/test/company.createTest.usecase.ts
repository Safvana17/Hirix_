import { TestEntity } from "../../../../Domain/entities/Test.entity";
import { TestCandidateEntity } from "../../../../Domain/entities/TestCandidate.entity";
import { TestQuestionEntity } from "../../../../Domain/entities/TestQuestion.entity";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import { CandidateTestStatus, TestStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { autoSaveRules, BehaviorRules, NavigationRules, ProctoringRules, TestRules, TimingRules } from "../../../../Domain/valueObjects/test.rules";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { ITokenService } from "../../../interface/service/ITokenService";
import { CompanyCreateTestInputDTO, CompanyCreateTestOutputDTO } from "../../dtos/test/company.createTest.dto";
import { ICompanyCreateTestUsecase } from "../../interfaces/test/ICompany.createTest.usecase";

export class CompanyCreateTestUsecase implements ICompanyCreateTestUsecase {
    constructor (
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _jobRoleRepository: IJobRepository,
        private _tokenService: ITokenService,
        private _testCandidateRepository: ITestCandidateRepository,
        private _processNotificationUsecase: IAdminProcessNotificationUsecase
    ) {}

    async execute(request: CompanyCreateTestInputDTO): Promise<CompanyCreateTestOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const jobRole = await this._jobRoleRepository.findById(request.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(jobRole.createdById !== company.id){
            throw new AppError(TestMessages.error.JOBROLE_IS_NOT_OWN, statusCode.BAD_REQUEST)
        }

        const existing = await this._testRepository.findByName(request.name, company.id)
        if(existing){
            throw new AppError(TestMessages.error.ALREADY_EXISTS, statusCode.CONFLICT)
        }

        const activeTest = await this._testRepository.findByJobroleId(jobRole.id, company.id)
        if(activeTest){
            throw new AppError(TestMessages.error.CANNOT_CREATE_TEST_FOR_THIS_ROLE, statusCode.BAD_REQUEST)
        }

        if(request.startTime >= request.endTime) {
            throw new AppError(TestMessages.error.INVALID_END_TIME, statusCode.BAD_REQUEST)
        }

        if(!request.questions || request.questions.length === 0){
            throw new AppError(TestMessages.error.QUESTIONS_REQUIRED, statusCode.BAD_REQUEST)
        }

        if(!request.candidates || request.candidates.length === 0){
            throw new AppError(TestMessages.error.CANDIDATES_REQUIRED, statusCode.BAD_REQUEST)
        }

        const rules = new TestRules(
            new TimingRules(
                request.rules.timing.durationInMinutes,
                request.rules.timing.autoSubmitOnTimeEnd ?? true,
                request.rules.timing.warningBeforeEndInMinutes ?? 3
            ),
            new NavigationRules(
                request.rules.navigation.allowTabSwitch ?? false,
                request.rules.navigation.maxTabSwitchCount ?? 0,
                request.rules.navigation.autoSubmitOnTabViolation ?? true,
                request.rules.navigation.shuffleQuestions ?? true,
                request.rules.navigation.shuffleOptions ?? true,
                request.rules.navigation.allowBackNavigation ?? true,
            ),
            new ProctoringRules(
                request.rules.proctoring.enableCamera ?? false,
                request.rules.proctoring.captureSnapshots ?? false,
                request.rules.proctoring.snapshotIntervalSeconds ?? 60,
                request.rules.proctoring.detectNoFace ?? false,
                request.rules.proctoring.detectMultipleFaces ?? false,
                request.rules.proctoring.maxWarningsAllowed ?? 3,
                request.rules.proctoring.autoSubmitOnMaxWarnings ?? true
            ),
            new BehaviorRules(
                request.rules.behavior.enforceFullScreen ?? true,
                request.rules.behavior.autoSubmitOnFullScreenExit ?? true,
                request.rules.behavior.allowCopyPaste ?? false,
                request.rules.behavior.allowRightClick ?? false,
                request.rules.behavior.allowKeyboardShortcuts ?? false
            ),
            new autoSaveRules(
                request.rules.autoSave.enabled ?? true,
                request.rules.autoSave.intervalInSeconds ?? 10,
                request.rules.autoSave.saveOnEveryAnswer ??true
            )
        )

        const questions = request.questions.map((q, idx) => {
            return new TestQuestionEntity(
                '',
                q.source,
                q.type,
                q.title,
                q.order ?? idx + 1,
                q.mark,
                q.questionId,
                q.description,
                q.options,
                q.answer,
                q.testCase
            )
        })

        const test = new TestEntity(
            '',
            request.name,
            request.companyId,
            request.jobRoleId,
            request.description,
            request.startTime,
            request.endTime,
            rules,
            questions,
            TestStatus.ACTIVE
        )

        const savedTest = await this._testRepository.create(test)
    
        const savedCandidatesWithLinks = await Promise.all(
            request.candidates.map( async (candidate) => {
                const token = this._tokenService.generateTestToken()
                const testCandidate =  new TestCandidateEntity(
                    '',
                    savedTest.id,
                    candidate.email,
                    token,
                    CandidateTestStatus.INVITED,
                    0,
                    [],
                )

                const savedCandidate = await this._testCandidateRepository.create(testCandidate)
                const testLink = `http://localhost:5173/candidate/test/${token}`

                return {
                    candidate: savedCandidate,
                    testLink
                }
            })
        )

        await Promise.all(
            savedCandidatesWithLinks.map(({candidate, testLink}) => {
                return this._processNotificationUsecase.execute({
                    event: NotificationEvents.TEST_INVITE,
                    recipients: [{
                        recipientId: candidate.id,
                        recipientType: userRole.Candidate,
                        email: candidate.email
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