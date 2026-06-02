import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PaymentHistory, PaymentHistoryArgs, PaymentHistoryResponse,RevenueSummary, AdminSummary, RevenueTrendMonth, RevenueTrendPlan, TestActivityTrend, SubscriptionDistribution, CompanySummery } from "../../../../types/analytics"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"
import type { TargetType } from "../../../../types/subscription"

interface AdminAnalyticsState {
    loading: boolean
    error: string | null
    revenueSummary: RevenueSummary | null
    adminSummery: AdminSummary | null
    companySummery: CompanySummery | null
    monthlyRevenueTrend: RevenueTrendMonth[]
    testActivityTrend: TestActivityTrend[]
    planRevenueTrend: RevenueTrendPlan[]
    subscriptionDistribution: SubscriptionDistribution[]
    paymentHistory: PaymentHistory[]
    pagination: {
        payment: {
            totalPages: number
            totalCount: number
        }
    }
}

const initialState: AdminAnalyticsState = {
    loading: false,
    revenueSummary: null,
    adminSummery: null,
    companySummery: null,
    monthlyRevenueTrend: [],
    testActivityTrend: [],
    planRevenueTrend: [],
    subscriptionDistribution: [],
    paymentHistory: [],
    pagination: {
        payment: {
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
        // console.log('response: ', response.data.data)
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
        //console.log('response: ', response.data.data)
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
        // console.log('response: ', response.data.data)
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
        // console.log('test: ', response.data.data)
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
        console.log('response distribution: ', response.data.data)
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get subscription distribution')
    }
})

export const getCompanyDashboardSummary = createAsyncThunk<
CompanySummery,
void,
{rejectValue: string}
>('company/dashboardSummery', async (_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.ANALYTICS.DASHBOARD_SUMMERY)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        console.log('company: ', response.data.data)
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get dashboard summery')
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
            state.adminSummery= action.payload
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
            state.companySummery= action.payload
         })
         .addCase(getCompanyDashboardSummary.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get dashboard summery'
         })
    }
})

export default adminAnalyticsSlice.reducer