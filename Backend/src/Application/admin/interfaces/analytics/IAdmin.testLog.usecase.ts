import { AdminTestLogInputDTO, AdminTestLogOutputDTO } from "../../dtos/analytics/admin.testLog.dto";

export interface IAdminTestLogUsecase {
    execute(request: AdminTestLogInputDTO): Promise<AdminTestLogOutputDTO>
}