import { AdminGetRevenueTrendByPlanInputDTO, AdminGetRevenueTrendByPlanOutputDTO } from "../../dtos/analytics/admin.revenueTrendByPlan.dto";

export interface IAdminGetRevenueTrendByPlanUsecase {
    execute(request: AdminGetRevenueTrendByPlanInputDTO): Promise<AdminGetRevenueTrendByPlanOutputDTO>
}