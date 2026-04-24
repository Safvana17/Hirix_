import { SubscriptionPlanStatus } from "../../../../Domain/enums/subscription"

export interface AdminUpdateSubscriptionPlanStatusInputDTO {
    id: string
    status: SubscriptionPlanStatus
}

export interface AdminUpdateSubscriptionPlanStatusOutputDTO {
    id: string
    status: boolean
}