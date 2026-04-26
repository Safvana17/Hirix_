import { CandidateStartFreeTrialInputDTO, CandidateStartFreeTrialOutputDTO } from "../../dtos/subscription/candidate.startFreeTrial.dto";

export interface ICandidateStartFreeTrialUsecase {
    execute(request: CandidateStartFreeTrialInputDTO): Promise<CandidateStartFreeTrialOutputDTO>
}