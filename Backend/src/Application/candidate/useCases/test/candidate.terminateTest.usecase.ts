import { CandidateAnswerEntity } from "../../../../Domain/entities/CandidateAnswer.entity";
import { CandidateSelectionStatus, CandidateTestStatus, TestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateTerminateTestInputDTO, CandidateTerminateTestOutputDTO } from "../../dtos/test/candidate.terminateTest.dto";
import { ICandidateTerminateTestUsecase } from "../../interfaces/test/ICandidate.terminateTest.usecase";

export class CandidateTerminateTestUsecase implements ICandidateTerminateTestUsecase {
    constructor(
        private _testCandidateRepository: ITestCandidateRepository,
        private _testRepository: ITestRepository
    ) {}

    async execute(request: CandidateTerminateTestInputDTO): Promise<CandidateTerminateTestOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const test = await this._testRepository.findById(candidate.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(test.testStatus !== TestStatus.PUBLISHED){
            throw new AppError(TestMessages.error.NOT_PUBLISHED_TEST, statusCode.BAD_REQUEST)
        }

        candidate.candidateTestStatus = CandidateTestStatus.TERMINATED
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
        
        await this._testCandidateRepository.update(candidate.id, candidate)

        return {
            success: true
        }
    }
}