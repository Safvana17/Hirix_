import { CandidateSubmitAnswerInputDTO, CandidateSubmitAnswerOutputDTO } from "../../dtos/practiceLibrary/candidate.submitAnswer.dto";

export interface ICandidateSubmitAnswerUsecase {
    execute(request: CandidateSubmitAnswerInputDTO): Promise<CandidateSubmitAnswerOutputDTO>
}