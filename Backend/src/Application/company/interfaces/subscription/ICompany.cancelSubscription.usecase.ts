import { CompanyCancelSubscriptionInputDTO, CompanyCancelSubscriptionOutputDTO } from "../../dtos/subscription/company.cancelSubscription.dto";

export interface ICompanyCancelSubscriptionUsecase {
    execute(request: CompanyCancelSubscriptionInputDTO): Promise<CompanyCancelSubscriptionOutputDTO>
}