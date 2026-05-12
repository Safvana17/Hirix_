import { CandidateSubmitQuestionInputDTO, CandidateSubmitQuestionOutputDTO } from "../../dtos/test/candidate.submitQuestion.dto";

export interface ICandidateSubmitQuestionUsecase {
    execute(request: CandidateSubmitQuestionInputDTO): Promise<CandidateSubmitQuestionOutputDTO>
}