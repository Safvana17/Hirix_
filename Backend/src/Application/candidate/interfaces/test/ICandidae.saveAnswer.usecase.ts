import { CandidateSaveAnswerInputDTO, CandidateSaveAnswerOutputDTO } from "../../dtos/test/candidate.saveAnswer.dto";

export interface ICandidateSaveAnswerUsecase {
    execute(request: CandidateSaveAnswerInputDTO): Promise<CandidateSaveAnswerOutputDTO>
}