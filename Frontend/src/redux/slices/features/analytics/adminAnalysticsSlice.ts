import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RevenueSummery } from "../../../../types/analytics"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"

interface AdminAnalyticsState {
    loading: boolean
    error: string | null
    revenueSummery: RevenueSummery | null
}

const initialState: AdminAnalyticsState = {
    loading: false,
    revenueSummery: null,
    error: null
}

export const getRevenueSummery = createAsyncThunk<
RevenueSummery,
void,
{rejectValue: string}
>('revenue/summery', async (_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.ANALYTICS.REVENUE_SUMMERY)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        console.log('response: ', response.data.data)
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get revenue summery')
    }
})

const AdminAnalyticsSlice = createSlice({
    name: 'AdminAnalytics',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(getRevenueSummery.pending, (state) => {
            state.loading = true
         })
         .addCase(getRevenueSummery.fulfilled, (state, action) => {
            state.loading = false
            state.revenueSummery = action.payload
         })
         .addCase(getRevenueSummery.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get revenue summery'
         })
    }
})

export default AdminAnalyticsSlice.reducer