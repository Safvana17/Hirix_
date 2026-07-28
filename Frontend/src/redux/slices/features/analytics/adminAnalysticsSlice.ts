import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PaymentHistory, PaymentHistoryArgs, PaymentHistoryResponse,RevenueSummary, AdminSummary, RevenueTrendMonth, RevenueTrendPlan, TestActivityTrend, SubscriptionDistribution, CompanySummary, CandidateStatusDistribution, CandidateSummary, TestHistory, TestHistoryResponse, TestHistoryArgs, TestLog, TestLogResponse, TestLogArgs, CandidateParticipationTrend, CompanyUsage, RecentActivity, RecentActivityArgs, RecentActivityResponse } from "../../../../types/analytics"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"
import type { TargetType } from "../../../../types/subscription"

interface AdminAnalyticsState {
    loading: boolean
    error: string | null
    revenueSummary: RevenueSummary | null
    adminSummary: AdminSummary | null
    companySummary: CompanySummary | null
    candidateSummary: CandidateSummary | null
    monthlyRevenueTrend: RevenueTrendMonth[]
    testActivityTrend: TestActivityTrend[]
    planRevenueTrend: RevenueTrendPlan[]
    subscriptionDistribution: SubscriptionDistribution[]
    statusDistribution: CandidateStatusDistribution[]
    candidateParticipation: CandidateParticipationTrend[]
    paymentHistory: PaymentHistory[]
    testHistory: TestHistory[]
    testLog: TestLog[]
    recentActivity: RecentActivity[]
    companyUsage: CompanyUsage[]
    pagination: {
        payment: {
            totalPages: number
            totalCount: number
        },
        test: {
            totalPages: number
            totalCount: number
        },
        activity: {
            totalPages: number,
            totalCount: number
        }
    }
}

const initialState: AdminAnalyticsState = {
    loading: false,
    revenueSummary: null,
    adminSummary: null,
    companySummary: null,
    candidateSummary: null,
    monthlyRevenueTrend: [],
    testActivityTrend: [],
    planRevenueTrend: [],
    subscriptionDistribution: [],
    paymentHistory: [],
    statusDistribution: [],
    candidateParticipation: [],
    testHistory: [],
    testLog: [],
    companyUsage: [],
    recentActivity: [],
    pagination: {
        payment: {
            totalCount: 0,
            totalPages: 0
        },
        test: {
            totalCount: 0,
            totalPages: 0
        }, 
        activity: {
            totalCount: 0,
            totalPages: 0
        }
    },
    error: null
}

export const getRevenueSummary = createAsyncThunk<
RevenueSummary,
void,
{rejectValue: string}
>('revenue/summery', async (_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.REVENUE_SUMMERY)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get revenue summery')
    }
})

export const getRevenueTrendByMonth = createAsyncThunk<
RevenueTrendMonth[],
{month: number},
{rejectValue: string}
>('revenue/trendMonth', async ({month}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.REVENUE_TREND_BY_MONTH, {params: {month}})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get revenue trend by month')
    }
})

export const getRevenueTrendByPlan = createAsyncThunk<
RevenueTrendPlan[],
{type: TargetType | undefined},
{rejectValue: string}
>('revenue/trendPlan', async ({type}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.REVENUE_TREND_BY_PLAN, {params: {type}})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get revenue trend by plan')
    }
})

export const getPaymentHistory = createAsyncThunk<
PaymentHistoryResponse,
{params: PaymentHistoryArgs},
{rejectValue: string}
>('payment/history', async ({params}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.PAYMENT_HISTORY, {params})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get payment history')
    }
})

export const getAdminDashboardSummary = createAsyncThunk<
AdminSummary,
void,
{rejectValue: string}
>('admin/dashboardSummery', async (_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.ADMIN_DASHBOARD_SUMMERY)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get admin dashboard summery')
    }
})

export const getTestActivty = createAsyncThunk<
TestActivityTrend[],
{month: number},
{rejectValue: string}
>('admin/testActivity', async ({month}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.TEST_ACTIVITY, {params: {month}})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get test activity')
    }
})

export const getSubscriptionDistribution = createAsyncThunk<
SubscriptionDistribution[],
{type: TargetType | undefined},
{rejectValue: string}
>('admin/subscriptionDistribution', async ({type}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.SUBSCRIPTION_DISTRIBUTION, {params: {type}})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get subscription distribution')
    }
})

export const getCompanyDashboardSummary = createAsyncThunk<
CompanySummary,
void,
{rejectValue: string}
>('company/dashboardSummery', async (_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.ANALYTICS.DASHBOARD_SUMMERY)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get dashboard summery')
    }
})

export const getTestParticipationTrend = createAsyncThunk<
TestActivityTrend[],
{month: number},
{rejectValue: string}
>('company/testActivity', async ({month}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.ANALYTICS.TEST_TREND, {params: {month}})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get test activity')
    }
})

export const getCandidateStatusDistribution = createAsyncThunk<
CandidateStatusDistribution[],
{month: number},
{rejectValue: string}
>('company/candidateStatus', async ({month}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.ANALYTICS.STATUS_DISTRIBUTION, {params: {month}})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get candidate status distribution')
    }
})

export const getCandidateDashboardSummary = createAsyncThunk<
CandidateSummary,
void,
{rejectValue: string}
>('candidate/dashboardSummery', async (_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.CANDIDATE.ANALYTICS.SUMMERY)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get candidate dashboard summery')
    }
})

export const getTestHistory = createAsyncThunk<
TestHistoryResponse,
{params: TestHistoryArgs},
{rejectValue: string}
>('test/history', async ({params}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.CANDIDATE.ANALYTICS.TEST_HISTORY, {params})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get test history')
    }
})

export const getTestLog = createAsyncThunk<
TestLogResponse,
{params: TestLogArgs},
{rejectValue: string}
>('test/log', async ({params}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.TEST_ACTIVITY_LOG, {params})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get test log')
    }
})

export const getCandidateParticipationTrend = createAsyncThunk<
CandidateParticipationTrend[],
{month: number},
{rejectValue: string}
>('test/participation', async ({month}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.CANDIDATE_PARTICIPATION, {params: {month}})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get candidate participation trend')
    }
})

export const getCompanyUsage = createAsyncThunk<
CompanyUsage[],
void,
{rejectValue: string}
>('admin/companyUsage', async (_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.COMPANY_USAGE)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get company usage')
    }
})

export const getAdminRecentActivity = createAsyncThunk<
RecentActivityResponse,
{params: RecentActivityArgs},
{rejectValue: string}
>('admin/recentActivity', async ({params}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.RECENT_ACTIVITY, {params})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get recent activity')
    }
})

export const getCompanyRecentActivity = createAsyncThunk<
RecentActivityResponse,
{params: RecentActivityArgs},
{rejectValue: string}
>('company/recentActivity', async ({params}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.ANALYTICS.RECENT_ACTIVITIES, {params})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get recent activity')
    }
})

const adminAnalyticsSlice = createSlice({
    name: 'adminAnalytics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(getRevenueSummary.pending, (state) => {
            state.loading = true
         })
         .addCase(getRevenueSummary.fulfilled, (state, action) => {
            state.loading = false
            state.revenueSummary = action.payload
         })
         .addCase(getRevenueSummary.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get revenue summery'
         })
         .addCase(getRevenueTrendByMonth.pending, (state) => {
            state.loading = true
         })
         .addCase(getRevenueTrendByMonth.fulfilled, (state, action) => {
            state.loading = false
            state.monthlyRevenueTrend = action.payload
         })
         .addCase(getRevenueTrendByMonth.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get revenue trend by month'
         })
         .addCase(getRevenueTrendByPlan.pending, (state) => {
            state.loading = true
         })
         .addCase(getRevenueTrendByPlan.fulfilled, (state, action) => {
            state.loading = false
            state.planRevenueTrend = action.payload
         })
         .addCase(getRevenueTrendByPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get revenue trend by plan'
         })
         .addCase(getPaymentHistory.pending, (state) => {
            state.loading = true
         })
         .addCase(getPaymentHistory.fulfilled, (state, action) => {
            state.loading = false
            state.paymentHistory = action.payload.history
            state.pagination.payment.totalCount = action.payload.totalCount
            state.pagination.payment.totalPages = action.payload.totalPages
         })
         .addCase(getPaymentHistory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get payment history'
         })
         .addCase(getAdminDashboardSummary.pending, (state) => {
            state.loading = true
         })
         .addCase(getAdminDashboardSummary.fulfilled, (state, action) => {
            state.loading = false
            state.adminSummary= action.payload
         })
         .addCase(getAdminDashboardSummary.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get admin dashboard summery'
         })
         .addCase(getTestActivty.pending, (state) => {
            state.loading = true
         })
         .addCase(getTestActivty.fulfilled, (state, action) => {
            state.loading = false
            state.testActivityTrend = action.payload
         })
         .addCase(getTestActivty.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get test activity'
         })
         .addCase(getSubscriptionDistribution.pending, (state) => {
            state.loading = true
         })
         .addCase(getSubscriptionDistribution.fulfilled, (state, action) => {
            state.loading = false
            state.subscriptionDistribution = action.payload
         })
         .addCase(getSubscriptionDistribution.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get subscription distribution'
         })
         .addCase(getCompanyDashboardSummary.pending, (state) => {
            state.loading = true
         })
         .addCase(getCompanyDashboardSummary.fulfilled, (state, action) => {
            state.loading = false
            state.companySummary= action.payload
         })
         .addCase(getCompanyDashboardSummary.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get dashboard summery'
         })
         .addCase(getTestParticipationTrend.pending, (state) => {
            state.loading = true
         })
         .addCase(getTestParticipationTrend.fulfilled, (state, action) => {
            state.loading = false
            state.testActivityTrend = action.payload
         })
         .addCase(getTestParticipationTrend.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get test activity'
         })
         .addCase(getCandidateStatusDistribution.pending, (state) => {
            state.loading = true
         })
         .addCase(getCandidateStatusDistribution.fulfilled, (state, action) => {
            state.loading = false
            state.statusDistribution= action.payload
         })
         .addCase(getCandidateStatusDistribution.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get candidate status distribution'
         })
         .addCase(getCandidateDashboardSummary.pending, (state) => {
            state.loading = true
         })
         .addCase(getCandidateDashboardSummary.fulfilled, (state, action) => {
            state.loading = false
            state.candidateSummary= action.payload
         })
         .addCase(getCandidateDashboardSummary.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get candidate dashboard summery'
         })
         .addCase(getTestHistory.pending, (state) => {
            state.loading = true
         })
         .addCase(getTestHistory.fulfilled, (state, action) => {
            state.loading = false
            state.testHistory = action.payload.history
            state.pagination.test.totalCount = action.payload.totalCount
            state.pagination.test.totalPages = action.payload.totalPages
         })
         .addCase(getTestHistory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get test history'
         })
         .addCase(getTestLog.pending, (state) => {
            state.loading = true
         })
         .addCase(getTestLog.fulfilled, (state, action) => {
            state.loading = false
            state.testLog = action.payload.test
            state.pagination.test.totalCount = action.payload.totalCount
            state.pagination.test.totalPages = action.payload.totalPages
         })
         .addCase(getTestLog.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get test log'
         })
         .addCase(getCandidateParticipationTrend.pending, (state) => {
            state.loading = true
         })
         .addCase(getCandidateParticipationTrend.fulfilled, (state, action) => {
            state.loading = false
            state.candidateParticipation = action.payload
         })
         .addCase(getCandidateParticipationTrend.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get candidate participation trend'
         })
         .addCase(getCompanyUsage.pending, (state) => {
            state.loading = true
         })
         .addCase(getCompanyUsage.fulfilled, (state, action) => {
            state.loading = false
            state.companyUsage = action.payload
         })
         .addCase(getCompanyUsage.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get company usage'
         })
         .addCase(getAdminRecentActivity.pending, (state) => {
            state.loading = true
         })
         .addCase(getAdminRecentActivity.fulfilled, (state, action) => {
            state.loading = false
            state.recentActivity = action.payload.activities
            state.pagination.activity.totalCount = action.payload.totalCount
            state.pagination.activity.totalPages = action.payload.totalPages
         })
         .addCase(getAdminRecentActivity.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get recent activity'
         })
         .addCase(getCompanyRecentActivity.pending, (state) => {
            state.loading = true
         })
         .addCase(getCompanyRecentActivity.fulfilled, (state, action) => {
            state.loading = false
            state.recentActivity = action.payload.activities
            state.pagination.activity.totalCount = action.payload.totalCount
            state.pagination.activity.totalPages = action.payload.totalPages
         })
         .addCase(getCompanyRecentActivity.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get recent activity'
         })
    }
})

export default adminAnalyticsSlice.reducer