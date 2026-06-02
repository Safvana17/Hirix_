import { TargetType } from "../../../../Domain/enums/subscription";

export interface AdminGetSubscriptionDistributionInputDTO {
    type?: TargetType
}

export interface SubscriptionDistributionDTO {
    plan: string
    type: TargetType
    count: number
}
export interface AdminGetSubscriptionDistributionOutputDTO {
    distribution: SubscriptionDistributionDTO[]
}
