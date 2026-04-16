import { SubscriptionPlanEntity } from "../../../../Domain/entities/SubscriptionPlan.entity";
// import { BillingCycle, subscriptionStatus } from "../../../../Domain/enums/subscription";


export interface CompanyChangeSubscriptionInputDTO {
    companyId: string
    planId: string
    // provider?: SubscriptionProvider
}

export interface CompanyChangeSubscriptionOutputDTO {
    newPlan: SubscriptionPlanEntity
    isPaymentRequired: boolean
}