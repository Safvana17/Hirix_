import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { CompanyGetAllPlanInputDTO, CompanyGetAllPlanOutputDTO } from "../../dtos/subscription/company.getAll.plan.dto";
import { ICompanyGetAllPlanUsecase } from "../../interfaces/subscription/ICompanyGetAllPlanUsecase";

export class CompanyGetAllPlanUsecase implements ICompanyGetAllPlanUsecase {
    constructor (
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: CompanyGetAllPlanInputDTO): Promise<CompanyGetAllPlanOutputDTO> {
        const { data, totalPages, totalCount } = await this._subscriptionPlanRepository.findAllFiltered(request)
        return {
            subscriptionPlans: data,
            totalPages,
            totalCount
        }
    }
}