import { CandidateWarningCountInputDTO, CandidateWarningCountOutputDTO } from "../../dtos/test/candidate.warningCount.dto";

export interface ICandidateWarningCountUsecase {
    execute(request: CandidateWarningCountInputDTO): Promise<CandidateWarningCountOutputDTO>
}