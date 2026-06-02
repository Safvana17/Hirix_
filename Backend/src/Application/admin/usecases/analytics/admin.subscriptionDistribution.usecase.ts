import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { logger } from "../../../../utils/logging/loger";
import { AdminGetSubscriptionDistributionInputDTO, AdminGetSubscriptionDistributionOutputDTO } from "../../dtos/analytics/admin.subscriptionDistribution.dto";
import { IAdminSubscriptionDistributionUsecase } from "../../interfaces/analytics/IAdmin.subscriptionDistribution.usecase";

export class AdminGetSubscriptionDistributionUsecase implements IAdminSubscriptionDistributionUsecase{
    constructor (
        private _subscriptionRepository: ISubscriptionRepository
    ) {}

    async execute(request: AdminGetSubscriptionDistributionInputDTO): Promise<AdminGetSubscriptionDistributionOutputDTO> {
        const distribution = await this._subscriptionRepository.getSubscriptionDistribution(request.type)
        logger.info(distribution, 'from usecase')
        return {
            distribution
        }
    }
}