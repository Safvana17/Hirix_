import type { PaymentStatus, TargetType } from "./subscription"
import type { CandidateSelectionStatus } from "./test"

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
    testCount?: number
    notAttendedCandidates?: number
    attendedCandidates: number
}
export interface SubscriptionDistribution {
    plan: string
    type: TargetType
    count: number
}

export interface CompanySummery {
    totalTests: number
    totalInterviews: number
    hiredCandidates: number
    currentPlan: string
}

export interface CandidateStatusDistribution {
    status: CandidateSelectionStatus
    count: number
}