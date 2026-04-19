import { SubscriptionPlanEntity } from "../../../../Domain/entities/SubscriptionPlan.entity";


export interface CandidateChangeSubscriptionInputDTO {
    candidateId: string
    planId: string
    // provider?: SubscriptionProvider
}

export interface CandidateChangeSubscriptionOutputDTO {
    newPlan: SubscriptionPlanEntity
    isPaymentRequired: boolean
}