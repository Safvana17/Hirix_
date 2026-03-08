import { UpdataStatusInputDTO, UpdateStatusOutputDTO } from "../../dtos/userManagement/updateStatus.admin.dto";

export interface IAdminUpdateCompanyStatusUsecase {
    execute(request: UpdataStatusInputDTO): Promise<UpdateStatusOutputDTO>
}