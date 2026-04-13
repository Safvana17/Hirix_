import { AdminUpdateSubscriptionPlanStatusInputDTO, AdminUpdateSubscriptionPlanStatusOutputDTO } from "../../dtos/subscriptionPlan/updateStatus.subscriptionPlan.dto";

export interface IAdminUpdateSubscriptionPlanStatusUsecase {
    execute(request: AdminUpdateSubscriptionPlanStatusInputDTO): Promise<AdminUpdateSubscriptionPlanStatusOutputDTO>
}