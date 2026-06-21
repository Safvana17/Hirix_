import { CandidateAnswerEntity } from "../../../../Domain/entities/CandidateAnswer.entity";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import { CandidateTestStatus, TestStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { CandidateSubmitTestInputDTO, CandidateSubmitTestOutputDTO } from "../../dtos/test/candidate.submitTest.dto";
import { ICandidateSubmitTestUsecase } from "../../interfaces/test/ICandidate.submitTest.usecase";

export class CandidateSubmitTestUsecase implements ICandidateSubmitTestUsecase{
    constructor(
        private _testCandidateRepositoy: ITestCandidateRepository,
        private _testRepository: ITestRepository,
        private _processNotification: IAdminProcessNotificationUsecase,
    ) {}

    async execute(request: CandidateSubmitTestInputDTO): Promise<CandidateSubmitTestOutputDTO> {
        const candidate = await this._testCandidateRepositoy.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(!request.clientSessionToken){
            throw new AppError(TestMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }
        if(candidate.sessionToken !== request.clientSessionToken){
            throw new AppError(TestMessages.error.SESSION_TOKEN_MISMATCHING, statusCode.FORBIDDEN)
        }

        if(candidate.candidateTestStatus !== CandidateTestStatus.IN_PROGRESS){
            throw new AppError(TestMessages.error.SUBMIT_TEST_NOT_ALLOWED, statusCode.BAD_REQUEST)
        }
        const test = await this._testRepository.findById(candidate.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(test.testStatus !== TestStatus.PUBLISHED){
            throw new AppError(TestMessages.error.NOT_PUBLISHED_TEST, statusCode.BAD_REQUEST)
        }

        candidate.candidateTestStatus = CandidateTestStatus.SUBMITTED
        candidate.submittedAt = new Date()
        const answers = request.answer.map((answer) => {
            return new CandidateAnswerEntity (
                '',
                answer.testQuestionId,
                answer.questionType,
                answer.timeTakenInSeconds,
                answer.selectedOptionIds,
                answer.descriptiveAnswer,
                answer.codingAnswer,
            )
        })
        candidate.candidateAnswers = answers
        candidate.warningCount = request.warningCount
        await this._testCandidateRepositoy.update(candidate.id, candidate)
        await this._processNotification.execute({
            event: NotificationEvents.TEST_SUBMITTED,
            recipients: [{
                recipientType: userRole.Company,
                recipientId: test.companyId
            }],
            variables: {
                candidateName: candidate.name!,
                testName: test.name
            }
        })

        return {
            success: true
        }
    }
}