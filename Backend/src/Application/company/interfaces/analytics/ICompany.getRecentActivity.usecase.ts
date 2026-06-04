import { CompanyGetRecentActivityInputDTO, CompanyGetRecentActivityOutputDTO } from "../../dtos/analytics/company.getRecentActivity.dto";

export interface ICompanyGetRecentActivity {
    execute(request: CompanyGetRecentActivityInputDTO): Promise<CompanyGetRecentActivityOutputDTO>
}