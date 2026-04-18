import { SubscriptionPlanEntity } from "../../../../Domain/entities/SubscriptionPlan.entity";
import { TargetType } from "../../../../Domain/enums/subscription";

export interface CandidateGetAllPlanInputDTO {
    target: TargetType
    page: number
    limit: number
}

export interface CandidateGetAllPlanOutputDTO {
    subscriptionPlans: SubscriptionPlanEntity[]
    totalPages: number
    totalCount: number
}