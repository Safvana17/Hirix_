import { AdminGetRecentActivityInputDTO, AdminGetRecentActivityOutputDTO } from "../../dtos/analytics/admin.recentActivity.dto";

export interface IAdminRecentActivityUsecase {
    execute(request: AdminGetRecentActivityInputDTO): Promise<AdminGetRecentActivityOutputDTO>
}