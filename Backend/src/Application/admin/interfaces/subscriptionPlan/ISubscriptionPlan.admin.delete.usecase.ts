import { AdminDeleteSubscriptionPlanInputDTO, AdminDeleteSubscriptionPlanOutputDTO } from "../../dtos/subscriptionPlan/delete.subscriptionPlan.dto";

export interface IAdminDeleteSubscriptionPlanUsecase {
    execute(request: AdminDeleteSubscriptionPlanInputDTO): Promise<AdminDeleteSubscriptionPlanOutputDTO>
}