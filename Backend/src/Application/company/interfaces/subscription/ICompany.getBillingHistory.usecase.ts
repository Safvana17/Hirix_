import { CompanyGetBillingHistoryInputDTO, CompanyGetBillingHistoryOutputDTO } from "../../dtos/subscription/company.billingHistory.dto";

export interface IGetCompanyBillingHistoryUsecase {
    execute(request: CompanyGetBillingHistoryInputDTO): Promise<CompanyGetBillingHistoryOutputDTO>
}