import { AdminCompanyUsegaeOutputDTO } from "../../dtos/analytics/admin.CompanyUsage.dto";

export interface IAdminCompanyUsageUsecase {
    execute(): Promise<AdminCompanyUsegaeOutputDTO>
}