import { CompanyChangeSubscriptionInputDTO, CompanyChangeSubscriptionOutputDTO } from "../../dtos/subscription/company.changeSubscription.dto";

export interface ICompanyChangeSubscriptionUsecase {
    execute(request: CompanyChangeSubscriptionInputDTO) : Promise<CompanyChangeSubscriptionOutputDTO>
}