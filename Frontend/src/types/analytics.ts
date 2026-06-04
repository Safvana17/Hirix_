import type { UserRole } from "../constants/role"
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

export interface CompanySummary {
    totalTests: number
    totalInterviews: number
    hiredCandidates: number
    currentPlan: string
}

export interface CandidateStatusDistribution {
    status: CandidateSelectionStatus
    count: number
}

export interface CandidateSummary {
    totalQuestionsAttempted: number
    accuracy: number
    totalTestAttended: number
    currentPlan: string
}

export interface TestHistory {
    id: string
    company: string
    testName: string
    jobRole: string
    status: CandidateSelectionStatus
    date: string
}

export interface TestHistoryResponse {
    history: TestHistory[]
    totalCount: number
    totalPages: number
}

export interface TestHistoryArgs {
    page?: number
    limit?: number
}

export interface TestLog {
    id: string
    company: string
    testName: string
    date: string
    candidates: number
    passRate: number
    averageScore: number
}

export interface TestLogResponse {
    test: TestLog[]
    totalCount: number
    totalPages: number
}

export interface TestLogArgs {
    page: number
    limit?: number
}

export interface CandidateParticipationTrend {
    month: string
    totalCandidates: number
    passedCount: number
    rejectedCount: number
}

export interface CompanyUsage {
    company: string
    totalTests: number
    totalInterviews: number
}

export interface RecentActivity{
    date: string
    title: string
    targetType: string
    role: UserRole
    action: string
}

export interface RecentActivityResponse {
    activities: RecentActivity[]
    totalPages: number
    totalCount: number
}

export interface RecentActivityArgs {
    page: number
    limit: number
    month: number
}