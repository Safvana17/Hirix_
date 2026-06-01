import { AdminRevenueSummeryOutputDTO } from "../../dtos/analytics/admin.revenueSummery.dto";

export interface IAdminRevenueSummeryUsecase {
    execute(): Promise<AdminRevenueSummeryOutputDTO>
}