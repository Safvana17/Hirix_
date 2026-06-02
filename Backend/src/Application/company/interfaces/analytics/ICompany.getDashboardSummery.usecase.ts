import { CompanyGetDashboardSummeryInputDTO, CompanyGetDashboardSummeryOutputDTO } from "../../dtos/analytics/company.getDashboardSummery.dto";

export interface ICompanyGetDashboardSummery {
    execute(request: CompanyGetDashboardSummeryInputDTO): Promise<CompanyGetDashboardSummeryOutputDTO>
}