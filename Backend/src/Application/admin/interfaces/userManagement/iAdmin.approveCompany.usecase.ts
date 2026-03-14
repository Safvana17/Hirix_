import { AdminApproveCompanyInputDTO, UpdateStatusOutputDTO } from '../../dtos/userManagement/updateStatus.admin.dto'


export interface IAdminApproveCompanyUsecase {
    execute(request: AdminApproveCompanyInputDTO): Promise<UpdateStatusOutputDTO>
}