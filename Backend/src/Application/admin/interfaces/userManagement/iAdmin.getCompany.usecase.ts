import { AdminGetCompanyInputDTO, AdminGetCompanyOutputDTO } from "../../dtos/userManagement/getCompany.admin.dto";

export interface IAdminGetCompanyUsecase {
    execute(request: AdminGetCompanyInputDTO): Promise<AdminGetCompanyOutputDTO>
}