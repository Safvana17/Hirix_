import type { PaymentStatus, TargetType } from "./subscription"

export interface RevenueSummary {
    totalRevenue: number
    monthlyRevenue: number
    activeSubscribers: number
    averageRevenuePerUser: number
}
export interface AdminSummary {
    totalRevenue: number
    totalCompanies: number
    totalCandidates: number
    totalTests: number
    totalQuestions: number
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

export interface PaymentHistory {
    id: string
    name: string
    plan: string
    target: TargetType
    amount: number
    date: string
    status: PaymentStatus
}

export interface PaymentHistoryResponse {
    history: PaymentHistory[]
    totalCount: number
    totalPages: number
}

export interface PaymentHistoryArgs{
    page: number
    limit: number
}

export interface TestActivityTrend {
    month: string
    testCount: number
    notAttendedCandidates: number
    attendedCandidates: number
}