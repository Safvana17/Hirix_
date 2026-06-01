import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RevenueSummary, RevenueTrendMonth } from "../../../../types/analytics"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"

interface AdminAnalyticsState {
    loading: boolean
    error: string | null
    revenueSummary: RevenueSummary | null
    monthlyRevenueTrend: RevenueTrendMonth[]
}

const initialState: AdminAnalyticsState = {
    loading: false,
    revenueSummary: null,
    monthlyRevenueTrend: [],
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
        console.log('response: ', response.data.data)
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get revenue trend by month')
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
    }
})

export default adminAnalyticsSlice.reducer