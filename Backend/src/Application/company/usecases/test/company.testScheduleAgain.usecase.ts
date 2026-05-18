import { TestEntity } from "../../../../Domain/entities/Test.entity";
import { TestCandidateEntity } from "../../../../Domain/entities/TestCandidate.entity";
import { TestQuestionEntity } from "../../../../Domain/entities/TestQuestion.entity";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import { CandidateTestStatus, QuestionMarks, TestStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { AutoSaveRules, BehaviorRules, NavigationRules, ProctoringRules, TestRules, TimingRules, WarningRules } from "../../../../Domain/valueObjects/test.rules";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { ITokenService } from "../../../interface/service/ITokenService";
import { CompanyScheduleAgainTestInputDTO, CompanyScheduleAgainTestOutputDTO } from "../../dtos/test/company.testScheduleAgain.dto";
import { ICompanyScheduleTestAgainUsecase } from "../../interfaces/test/ICompany.testScheduleAgain.usecase";

export class CompanyScheduleTestAgainUsecase implements ICompanyScheduleTestAgainUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _testRepository: ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _tokenService: ITokenService,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _jobRoleRepository: IJobRepository,
        private _processNotificationUsecase: IAdminProcessNotificationUsecase
    ) {}
    async execute(request: CompanyScheduleAgainTestInputDTO): Promise<CompanyScheduleAgainTestOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(company.id !== test.companyId){
            throw new AppError(TestMessages.error.NOT_ALLOWED, statusCode.FORBIDDEN)
        }

        const subscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const plan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        const now = new Date()
        const testLimit = plan.maxTestsPerMonth
        const candidateLimit = plan.maxCandidates
        if(testLimit != null){
            const startOfMonth = new Date( now.getFullYear() ,now.getMonth(), 1)
            const endOfMonth = new Date(now.getFullYear(), now.getMonth()+1, 0, 23, 59, 59)
            const currentCount = await this._testRepository.CountTestInMonth(company.id, startOfMonth, endOfMonth)
            if(currentCount >= testLimit){
                throw new AppError(TestMessages.error.TEST_LIMIT_EXCEEDED, statusCode.BAD_REQUEST, 'FEATURE_LOCKED')
            }
        }
        const jobRole = await this._jobRoleRepository.findById(test.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
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
        if(candidateLimit != null && request.candidates.length > candidateLimit){
            throw new AppError(TestMessages.error.TEST_CANDIDATES_COUNT_EXCEEDED, statusCode.BAD_REQUEST)
        }

        const oldCandidates = await this._testCandidateRepository.findByTestId(test.id)
        if(!oldCandidates){
            throw new AppError(TestMessages.error.CANDIDATES_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const requestedEmails = request.candidates.map((candidate) => candidate.email.toLowerCase().trim())
        const duplicateEmails = requestedEmails.filter((email, index) => requestedEmails.indexOf(email) !== index)
        if (duplicateEmails.length > 0) {
            throw new AppError(TestMessages.error.DUPLICATE_CANDIDATE_EMAIL,statusCode.BAD_REQUEST)
        }
        const oldCandidatesToReschedule = oldCandidates.filter((candidate) =>
            requestedEmails.includes(candidate.email.toLowerCase().trim()) 
        )
        const allowedOldStatuses = [CandidateTestStatus.INVITED, CandidateTestStatus.EXPIRED]

        for(let tc of oldCandidatesToReschedule){
            if(!allowedOldStatuses.includes(tc.candidateTestStatus)){
                throw new AppError(TestMessages.error.CANNOT_RESCHEDULT_CANDIDATE, statusCode.BAD_REQUEST)
            }
        }

        const rules = new TestRules(
            new TimingRules(
                request.rules.timing.autoSubmitOnTimeEnd ?? true,
                request.rules.timing.warningBeforeEndInMinutes ?? 3
            ),
            new NavigationRules(
                request.rules.navigation.allowTabSwitch ?? false,
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
            ),
            new BehaviorRules(
                request.rules.behavior.enforceFullScreen ?? true,
                request.rules.behavior.allowCopyPaste ?? false,
                request.rules.behavior.allowRightClick ?? false,
                request.rules.behavior.allowKeyboardShortcuts ?? false
            ),
            new AutoSaveRules(
                request.rules.autoSave.enabled ?? true,
                request.rules.autoSave.intervalInSeconds ?? 10,
                request.rules.autoSave.saveOnEveryAnswer ??true
            ),
            new WarningRules(
                request.rules.warning.maxWarningCount ?? 0,
                request.rules.warning.autoSubmitOnMaxWarnings ?? true
            )
        )
        
        const questions = request.questions.map((q, idx) => {
            return new TestQuestionEntity(
                "",
                q.source,
                q.type,
                q.title,
                q.order ?? idx + 1,
                QuestionMarks[q.type],
                q.questionId,
                q.description,
                q.options,
                q.answer,
                q.testCase
            )
        })
        const totalMarks = questions.reduce((acc, curr) => acc + curr.mark, 0)
        const newTest = new TestEntity(
            '',
            request.name,
            company.id,
            jobRole.id,
            request.description,
            request.startTime,
            request.endTime,
            rules,
            questions,
            TestStatus.PUBLISHED,
            false
        )
        const savedTest = await this._testRepository.create(newTest)
        for(const candidate of request.candidates){
            const token = this._tokenService.generateTestToken()
            const testCandidate = new TestCandidateEntity(
                "",
                savedTest.id,
                candidate.email,
                token,
                CandidateTestStatus.INVITED,
                0,
                [],
                totalMarks,
                savedTest.questions.length
            )
            const savedCandidate = await this._testCandidateRepository.create(testCandidate)

            await this._processNotificationUsecase.execute({
                event: NotificationEvents.TEST_INVITE,
                recipients: [{
                    recipientType: userRole.Candidate,
                    recipientId: savedCandidate.id,
                    email: savedCandidate.email
                }],
                variables: {
                    companyName: company.getName(),
                    jobRole: jobRole.name,
                    testName: savedTest.name,
                    startTime: savedTest.startTime.toLocaleString(),
                    endTime: savedTest.endTime.toLocaleString(),
                    testLink: `http://localhost:5173/candidate/test/${token}`,
                    instructions: [
                        "Do not switch tabs.",
                        "Do not copy or paste.",
                        "Stay in full screen mode.",
                        "The test will auto-submit when time ends.",
                        "Answers are auto-saved."
                    ].join("\n")
                }
            })
        }
        for(const oldCandidate of oldCandidatesToReschedule){
            oldCandidate.candidateTestStatus = CandidateTestStatus.RESCHEDULED
            await this._testCandidateRepository.update(oldCandidate.id, oldCandidate)
        }
        return {
            test: savedTest
        }
    }
}