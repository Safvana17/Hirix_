import { AdminGetRevenueTrendByMonthInputDTO, AdminGetRevenueTrendByMonthOutputDTO } from "../../dtos/analytics/admin.revenueTrendByMonth.dto";

export interface IAdminGetRevenueTrendByMonthUsecase {
    execute(request: AdminGetRevenueTrendByMonthInputDTO): Promise<AdminGetRevenueTrendByMonthOutputDTO>
}