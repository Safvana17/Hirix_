import { GetAllCompaniesOutputDTO } from "../../dtos/userManagement/getAllCompanies.admin.dto";

export interface IAdminGetAllCompaniesUsecase{
    exexute(): Promise<GetAllCompaniesOutputDTO[]>
}