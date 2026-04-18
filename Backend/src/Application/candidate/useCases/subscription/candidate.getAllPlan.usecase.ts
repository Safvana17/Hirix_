import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { CandidateGetAllPlanInputDTO, CandidateGetAllPlanOutputDTO } from "../../dtos/subscription/candidate.getAllPlans.dto";
import { ICandidateGetAllPlansUsecase } from "../../interfaces/subscription/ICandidate.getAllPlans.usecase";

export class CandidateGetAllPlanUsecase implements ICandidateGetAllPlansUsecase{
    constructor(
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: CandidateGetAllPlanInputDTO): Promise<CandidateGetAllPlanOutputDTO> {
        const { data, totalPages, totalCount } = await this._subscriptionPlanRepository.findAllFiltered(request)
        return {
            subscriptionPlans: data,
            totalPages,
            totalCount
        }
    }
}