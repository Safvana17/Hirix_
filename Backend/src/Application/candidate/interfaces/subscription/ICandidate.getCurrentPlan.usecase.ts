import { CandidateGetCurrentPlanInputDTO, CandidateGetCurrentPlanOutputDTO } from "../../dtos/subscription/candidate.getCurrentPlan.dto";

export interface ICandidateGetCurrentPlanUsecase {
    execute(request: CandidateGetCurrentPlanInputDTO): Promise<CandidateGetCurrentPlanOutputDTO>
}