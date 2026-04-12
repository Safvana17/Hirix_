import { AdminCreateSubscriptionPlanInputDTO, AdminCreateSubscriptionPlanOutputDTO } from "../../dtos/subscriptionPlan/create.subscriptionPlan.dto";

export interface ICreateSubscriptionPlanUsecase {
    execute(request: AdminCreateSubscriptionPlanInputDTO): Promise<AdminCreateSubscriptionPlanOutputDTO>
}