import { CandidateGetAllPlanInputDTO, CandidateGetAllPlanOutputDTO } from "../../dtos/subscription/candidate.getAllPlans.dto";

export interface ICandidateGetAllPlansUsecase{
    execute(request: CandidateGetAllPlanInputDTO): Promise<CandidateGetAllPlanOutputDTO>
}