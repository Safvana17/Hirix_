export enum TargetType {
    CANDIDATE = 'candidate',
    COMPANY = 'company',
}

export enum BillingCycle {
    MONTHLY = 'monthly',
    YEARLY = 'yearly'
}

export const DurationDays: Record<BillingCycle, number> = {
    [BillingCycle.MONTHLY]: 30,
    [BillingCycle.YEARLY]: 365
}

export enum SubscriptionStatus {
    ACTIVE = 'activate',
    INACTIVE = 'deactivate'
}