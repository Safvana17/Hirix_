import { CandidateGetExplanationInputDTO, CandidateGetExplanationOutputDTO } from "../../dtos/practiceLibrary/candidate.getExplanation.dto";

export interface ICandidateGetExplanationUsecase {
    execute(request: CandidateGetExplanationInputDTO): Promise<CandidateGetExplanationOutputDTO>
}