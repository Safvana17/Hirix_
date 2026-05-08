import { TestCandidateEntity } from "../../../../Domain/entities/TestCandidate.entity";
import { TestQuestionEntity } from "../../../../Domain/entities/TestQuestion.entity";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import { CandidateTestStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { AutoSaveRules, BehaviorRules, NavigationRules, ProctoringRules, TestRules, TimingRules } from "../../../../Domain/valueObjects/test.rules";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { ITokenService } from "../../../interface/service/ITokenService";
import { CompanyEditTestInputDTO, CompanyEditTestOutputDTO } from "../../dtos/test/company.editTest.dto";
import { ICompanyEditTestUsecase } from "../../interfaces/test/ICompany.editTest.usecase";

export class CompanyEditTestUsecase implements ICompanyEditTestUsecase{
    constructor(
        private _companyRepository: ICompanyRepository,
        private _testRepository: ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _tokenService: ITokenService,
        private _jobRoleRepository: IJobRepository,
        private  _processNotificationUsecase: IAdminProcessNotificationUsecase
    ) {}

    async execute(request: CompanyEditTestInputDTO): Promise<CompanyEditTestOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const existing = await this._testRepository.findByName(request.name, company.id)
        if(existing && existing.id !== test.id){
            throw new AppError(TestMessages.error.ALREADY_EXISTS, statusCode.CONFLICT)
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

        const existingCandidates = await this._testCandidateRepository.findByTestId(test.id)
        if(!existingCandidates){
            throw new AppError(TestMessages.error.CANDIDATES_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const oldEmails = existingCandidates.map((tc) => tc.email.toLowerCase())
        const newEmails = request.candidates.map((tc) => tc.email.toLowerCase())
        const addedEmails = newEmails.filter((e) => !oldEmails.includes(e))
        const removedEmails = oldEmails.filter((e) => !newEmails.includes(e))

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
            new AutoSaveRules(
                request.rules.autoSave.enabled ?? true,
                request.rules.autoSave.intervalInSeconds ?? 10,
                request.rules.autoSave.saveOnEveryAnswer ??true
            )
        )
        test.name = request.name
        test.description = request.description
        test.rules = rules
        test.questions = request.questions.map((q, idx) => {
            return new TestQuestionEntity(
                q.id ?? "",
                q.source,
                q.type,
                q.title,
                q.order ?? idx + 1,
                q.mark ?? 1,
                q.questionId,
                q.description,
                q.options,
                q.answer,
                q.testCase
            )
        })

        await Promise.all(
            addedEmails.map(async (email) => {
                const token = this._tokenService.generateTestToken()
                const candidate = new TestCandidateEntity(
                    "",
                    test.id,
                    email,
                    token,
                    CandidateTestStatus.INVITED,
                    0,
                    []
                )
                await this._testCandidateRepository.create(candidate)

                await this._processNotificationUsecase.execute({
                    event: NotificationEvents.TEST_INVITE,
                    recipients: [{
                        recipientId: candidate.id,
                        recipientType: userRole.Candidate,
                        email
                    }],
                    variables: {
                        companyName: company.getName(),
                        testName: test.name,
                        testLink: `http://localhost:5173/candidate/test/${token}`,
                        startTime: test.startTime.toLocaleString(),
                        endTime: test.endTime.toLocaleString(),
                        role: jobRole.name,
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

        await Promise.all(
            existingCandidates
            .filter(c => removedEmails.includes(c.email.toLowerCase()))
            .map(async (candidate) => {
                candidate.candidateTestStatus = CandidateTestStatus.REMOVED
                await this._testCandidateRepository.update(candidate.id, candidate)

                await this._processNotificationUsecase.execute({
                    event: NotificationEvents.TEST_REMOVED,
                    recipients: [{
                        recipientId: candidate.id,
                        recipientType: userRole.Candidate,
                        email: candidate.email
                    }], 
                    variables: {
                        testName: test.name,
                        companyName: company.getName(),
                        role: jobRole.name
                    }
                })
            })
        )

        const savedTest = await this._testRepository.update(test.id, test)
        if(!savedTest){
            throw new AppError(TestMessages.error.TEST_UPDATE_FAILED, statusCode.SERVER_ERROR)
        }
        return {
            test: savedTest
        }
    }
}