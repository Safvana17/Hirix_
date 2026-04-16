import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ChangePlanResponse, CurrentPlan, GetAllPlansResponse, MakePaymentResponse, SubscriptionPlan, TargetType, userGetAllPlansParams } from "../../../../types/subscription";
import type { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";

interface SubscriptionState {
    loading: boolean;
    error: string | null;
    plans: SubscriptionPlan[];
    currentPlan: CurrentPlan | null;
    selectedPlan: SubscriptionPlan | null;
    isPaymentRequired: boolean;
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
    currentPlan: null,
    isPaymentRequired: false,
    selectedPlan: null,
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
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all plans')
    }
})

export const getCurrentPlan = createAsyncThunk<
CurrentPlan,
void,
{rejectValue: string}
>('userSubscription/getCurrentPlan', async(_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.SUBSCRIPTION.GET_CURRENT)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log('current plan from slice',response.data)
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all plans')
    }
})

export const changeSubscription = createAsyncThunk<
ChangePlanResponse,
{planId: string},
{rejectValue: string}
>('subscription/changeSubscription', async({planId}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.COMPANY.SUBSCRIPTION.CHANGE_SUBSCRIPTION, {planId})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to change subscription')
    }
})

export const makePayment = createAsyncThunk<
MakePaymentResponse,
{planId: string},
{rejectValue: string}
>('subscription/makePayment', async({planId}, {rejectWithValue}) => {
    try {
       const response = await api.post(API_ROUTES.COMPANY.SUBSCRIPTION.MAKE_PAYMENT, {planId})
       if(!response.data.success){
        return rejectWithValue('Invalid response')
       } 

       return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to make payment')
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
        .addCase(getCurrentPlan.pending, (state) => {
            state.loading = true
        })
        .addCase(getCurrentPlan.fulfilled, (state, action) => {
            state.loading = false
            state.currentPlan = action.payload
        })
        .addCase(getCurrentPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get current plan'
        })
        .addCase(changeSubscription.pending, (state) => {
            state.loading = true
        })
        .addCase(changeSubscription.fulfilled, (state, action) => {
            state.loading = false
            state.isPaymentRequired = action.payload.isPaymentRequired
            state.selectedPlan = action.payload.newPlan
        })
        .addCase(changeSubscription.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to change subscription'
        })
        .addCase(makePayment.pending, (state) => {
            state.loading = true
        })
        .addCase(makePayment.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(makePayment.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to make payment'
        })
    }
})

export const { reset } = subscriptionSlice.actions
export default subscriptionSlice.reducer