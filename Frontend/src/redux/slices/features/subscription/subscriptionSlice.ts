import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { GetAllPlansResponse, SubscriptionPlan, TargetType, userGetAllPlansParams } from "../../../../types/subscription";
import type { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";

interface SubscriptionState {
    loading: boolean;
    error: string | null;
    plans: SubscriptionPlan[];
    pagination: {
        plans: {
            totalPages: number;
            totalCount: number;
        }
    }
}

const initialState: SubscriptionState = {
    loading: true,
    plans: [],
    error: null,
    pagination: {
        plans: {
            totalPages: 0,
            totalCount: 0
        }
    }
}

export const getAllPlans = createAsyncThunk<
GetAllPlansResponse,
userGetAllPlansParams,
{rejectValue: string}
>('userSubscription/getAllPlans', async(params: { target: TargetType, page?: number, limit?: number}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.SUBSCRIPTION.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log(response.data)
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all plans')
    }
})



const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        reset: (state) =>{
            state.loading = true
            state.plans = []
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllPlans.pending, (state) => {
            state.loading = true
        })
        .addCase(getAllPlans.fulfilled, (state, action) => {
            state.loading = false
            state.plans = action.payload.subscriptionPlans
            state.pagination.plans.totalCount = action.payload.totalCount
            state.pagination.plans.totalPages = action.payload.totalPages
        })
        .addCase(getAllPlans.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all plans'
        })
    }
})

export const { reset } = subscriptionSlice.actions
export default subscriptionSlice.reducer