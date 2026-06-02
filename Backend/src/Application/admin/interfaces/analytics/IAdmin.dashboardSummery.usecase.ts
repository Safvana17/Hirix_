import { AdminDashboardSummeryOutputDTO } from "../../dtos/analytics/admin.dashboardSumery.dto";

export interface IAdminGetDashboardSummeryUsecase {
    execute(): Promise<AdminDashboardSummeryOutputDTO>
}