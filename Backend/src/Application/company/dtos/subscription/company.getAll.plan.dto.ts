import { SubscriptionPlanEntity } from "../../../../Domain/entities/SubscriptionPlan.entity";
import { TargetType } from "../../../../Domain/enums/subscription";

export interface CompanyGetAllPlanInputDTO {
    target: TargetType
    page: number
    limit: number
}

export interface CompanyGetAllPlanOutputDTO {
    subscriptionPlans: SubscriptionPlanEntity[]
    totalPages: number
    totalCount: number
}