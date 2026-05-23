import { CandidateAnswerEntity } from "../../../../Domain/entities/CandidateAnswer.entity";
import { CandidateTestStatus, TestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateSaveAnswerInputDTO, CandidateSaveAnswerOutputDTO } from "../../dtos/test/candidate.saveAnswer.dto";
import { ICandidateSaveAnswerUsecase } from "../../interfaces/test/ICandidae.saveAnswer.usecase";

export class CandidateSaveAnswerUsecase implements ICandidateSaveAnswerUsecase {
    constructor(
        private _testRepository: ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository
    ) {}

    async execute(request: CandidateSaveAnswerInputDTO): Promise<CandidateSaveAnswerOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(candidate.candidateTestStatus !== CandidateTestStatus.IN_PROGRESS){
            throw new AppError(TestMessages.error.SAVE_ANSWER_NOT_ALLOWED, statusCode.BAD_REQUEST)
        }
        const test = await this._testRepository.findById(candidate.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(test.testStatus !== TestStatus.PUBLISHED){
            throw new AppError(TestMessages.error.NOT_PUBLISHED_TEST, statusCode.BAD_REQUEST)
        }

        for(let answer of request.answer){
            const existingAnswerIndex = candidate.candidateAnswers.findIndex(candidateAnswer => candidateAnswer.testQuestionId === answer.testQuestionId)
            const updatedAnswers = new CandidateAnswerEntity(
                existingAnswerIndex >= 0 ? candidate.candidateAnswers[existingAnswerIndex].id : "",
                answer.testQuestionId,
                answer.questionType,
                answer.timeTakenInSeconds,
                answer.selectedOptionIds,
                answer.descriptiveAnswer,
                answer.codingAnswer
            )

            if(existingAnswerIndex >= 0){
                candidate.candidateAnswers[existingAnswerIndex] = updatedAnswers
            }else{
                candidate.candidateAnswers.push(updatedAnswers)
            }
        }
        await this._testCandidateRepository.update(candidate.id, candidate)

        return {
            success: true
        }
    }
}