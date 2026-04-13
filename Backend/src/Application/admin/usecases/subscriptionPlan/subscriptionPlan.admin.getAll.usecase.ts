import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { logger } from "../../../../utils/logging/loger";
import { AdminGetAllSubscriptionPlanInputDTO, AdminGetAllSubscriptionPlanOutputDTO } from "../../dtos/subscriptionPlan/getAll.subscriptionPlan.admin.dto";
import { IAdminGetAllSubscriptionPlanUsecase } from "../../interfaces/subscriptionPlan/ISubscriptionPlan.admin.getAll.usecase";

export class AdminGetAllSubscriptionPlanUsecase implements IAdminGetAllSubscriptionPlanUsecase {
    constructor(
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: AdminGetAllSubscriptionPlanInputDTO): Promise<AdminGetAllSubscriptionPlanOutputDTO> {
        const { data, totalPages, totalCount } = await this._subscriptionPlanRepository.findAllFiltered(request)
        logger.info(data, 'from usecase')
        return {
            subscriptionPlans: data,
            totalPages,
            totalCount
        }
    }
}