import { AdminRejectCompanyInputDTO, UpdateStatusOutputDTO } from '../../dtos/userManagement/updateStatus.admin.dto'


export interface IAdminRejectCompanyUsecase {
    execute(request: AdminRejectCompanyInputDTO): Promise<UpdateStatusOutputDTO>
}