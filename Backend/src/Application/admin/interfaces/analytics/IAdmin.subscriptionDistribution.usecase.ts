import { AdminGetSubscriptionDistributionInputDTO, AdminGetSubscriptionDistributionOutputDTO } from "../../dtos/analytics/admin.subscriptionDistribution.dto";

export interface IAdminSubscriptionDistributionUsecase {
    execute(request: AdminGetSubscriptionDistributionInputDTO): Promise<AdminGetSubscriptionDistributionOutputDTO>
}