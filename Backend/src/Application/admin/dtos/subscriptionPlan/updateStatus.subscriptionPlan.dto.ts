import { SubscriptionStatus } from "../../../../Domain/enums/subscription"

export interface AdminUpdateSubscriptionPlanStatusInputDTO {
    id: string
    status: SubscriptionStatus
}

export interface AdminUpdateSubscriptionPlanStatusOutputDTO {
    success: boolean
}