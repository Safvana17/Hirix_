import { TestEntity } from "../../../../Domain/entities/Test.entity";
import { TestCandidateEntity } from "../../../../Domain/entities/TestCandidate.entity";
import { TestQuestionEntity } from "../../../../Domain/entities/TestQuestion.entity";
import { CandidateTestStatus, TestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { autoSaveRules, BehaviorRules, NavigationRules, ProctoringRules, TestRules, TimingRules } from "../../../../Domain/valueObjects/test.rules";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyCreateTestInputDTO, CompanyCreateTestOutputDTO } from "../../dtos/test/company.createTest.dto";
import { ICompanyCreateTestDraftUsecase } from "../../interfaces/test/ICompany.createTestDraft.usecase";

export class CompanyCreateTestDraftUsecase implements ICompanyCreateTestDraftUsecase {
    constructor (
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _jobRoleRepository: IJobRepository,
        private _testCandidateRepository: ITestCandidateRepository,
    ) {}

    async execute(request: CompanyCreateTestInputDTO): Promise<CompanyCreateTestOutputDTO> {
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

        if(candidateLimit != null && request.candidates.length > candidateLimit){
            throw new AppError(TestMessages.error.TEST_CANDIDATES_COUNT_EXCEEDED, statusCode.BAD_REQUEST)
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
            TestStatus.DRAFT,
            false
        )

        const savedTest = await this._testRepository.create(test)
        await Promise.all(
            request.candidates.map((candidate) => {
                const testCandidate = new TestCandidateEntity(
                    "",
                    savedTest.id,
                    candidate.email,
                    "",
                    CandidateTestStatus.DRAFT,
                    0,
                    [],
                )
                return this._testCandidateRepository.create(testCandidate)
            })
        )
        return {
            test: savedTest
        }
    }
}