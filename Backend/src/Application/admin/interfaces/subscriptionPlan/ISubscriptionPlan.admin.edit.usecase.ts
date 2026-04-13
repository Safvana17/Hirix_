import { AdminEditSubscriptionPlanInputDTO, AdminEditSubscriptionPlanOutputDTO } from "../../dtos/subscriptionPlan/edit.subscriptionPlan.dto";

export interface IAdminEditSubscriptionPlanUsecase {
    execute(request: AdminEditSubscriptionPlanInputDTO): Promise<AdminEditSubscriptionPlanOutputDTO>
}