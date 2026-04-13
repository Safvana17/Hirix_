import { SubscriptionPlanEntity } from "../../../../Domain/entities/SubscriptionPlan.entity";
import { TargetType } from "../../../../Domain/enums/subscription";

export interface AdminGetAllSubscriptionPlanInputDTO {
    target?: TargetType;
    page: number;
    limit: number
}

export interface AdminGetAllSubscriptionPlanOutputDTO {
    subscriptionPlans: SubscriptionPlanEntity[]
    totalPages: number
    totalCount: number
}