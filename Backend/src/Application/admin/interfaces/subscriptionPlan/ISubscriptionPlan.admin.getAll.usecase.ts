import { AdminGetAllSubscriptionPlanInputDTO, AdminGetAllSubscriptionPlanOutputDTO } from "../../dtos/subscriptionPlan/getAll.subscriptionPlan.admin.dto";

export interface IAdminGetAllSubscriptionPlanUsecase {
    execute(request: AdminGetAllSubscriptionPlanInputDTO): Promise<AdminGetAllSubscriptionPlanOutputDTO>
}