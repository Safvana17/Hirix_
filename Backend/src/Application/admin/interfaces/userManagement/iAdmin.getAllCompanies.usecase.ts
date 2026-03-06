import CompanyEntity from "../../../../Domain/entities/company.entity";

export interface IAdminGetAllCompaniesUsecase{
    exexute(): Promise<CompanyEntity[]>
}