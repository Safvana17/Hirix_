import type { TargetType } from "./subscription"

export interface RevenueSummary {
    totalRevenue: number
    monthlyRevenue: number
    activeSubscribers: number
    averageRevenuePerUser: number
}

export interface RevenueTrendMonth {
    month: string
    revenue: number
}

export interface RevenueTrendPlan {
    plan: string
    type: TargetType
    revenue: number
}