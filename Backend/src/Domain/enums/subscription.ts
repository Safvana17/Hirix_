export enum TargetType {
    CANDIDATE = 'candidate',
    COMPANY = 'company',
}

export enum BillingCycle {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
    FOREVER = 'forever'
}

export const DurationDays: Record<BillingCycle, number | null> = {
    [BillingCycle.MONTHLY]: 30,
    [BillingCycle.YEARLY]: 365,
    [BillingCycle.FOREVER]: null,
}

export enum SubscriptionPlanStatus {
    ACTIVE = 'activate',
    INACTIVE = 'deactivate'
}

export enum subscriptionStatus {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    CANCELLED = 'cancelled',
    PENDING = 'pending'
}

export enum SubscriptionProvider {
    RAZORPAY = 'razorpay',
    STRIPE = 'stripe'
}