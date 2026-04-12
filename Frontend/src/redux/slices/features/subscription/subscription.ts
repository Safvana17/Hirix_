import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CreatePlanPayload, SubscriptionPlan } from "../../../../types/subscription";
import type { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";


interface SubscriptionState {
    loading: boolean;
    error: string | null;
    plans: SubscriptionPlan[];
}

const initialState: SubscriptionState = {
    loading: true,
    plans: [],
    error: null
}

export const createPlan = createAsyncThunk<
SubscriptionPlan,
{data: CreatePlanPayload},
{rejectValue: string}
>('subscription/create', async({data}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.ADMIN.SUBSCRIPTION_PLAN.CREATE, data)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to create plan')
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
        .addCase(createPlan.pending, (state) => {
            state.loading = true
        })
        .addCase(createPlan.fulfilled, (state, action) => {
            state.loading = false
            state.plans.unshift(action.payload)
        })
        .addCase(createPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to create plan'
        })
    }
})

export const { reset } = subscriptionSlice.actions
export default subscriptionSlice.reducer