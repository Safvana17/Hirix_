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