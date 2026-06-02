import { AdminTestActivityInputDTO, AdminTestActivityOutputDTO } from "../../dtos/analytics/admin.testActivity.dto";

export interface IAdminGetTestActivityUsecase {
    execute(request: AdminTestActivityInputDTO): Promise<AdminTestActivityOutputDTO>
}