import { AdminPaginatedCompanyDTO, AdminCompanyQueryDTO } from "../../dtos/userManagement/getAllCompanies.admin.dto";

export interface IAdminGetAllCompaniesUsecase{
    exexute(query: AdminCompanyQueryDTO): Promise<AdminPaginatedCompanyDTO>
}