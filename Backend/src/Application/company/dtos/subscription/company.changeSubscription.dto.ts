import { BillingCycle, subscriptionStatus } from "../../../../Domain/enums/subscription";


export interface CompanyChangeSubscriptionInputDTO {
    companyId: string
    planId: string
    // provider?: SubscriptionProvider
}

export interface CompanyChangeSubscriptionOutputDTO {
    isPaymentRequired: boolean
}