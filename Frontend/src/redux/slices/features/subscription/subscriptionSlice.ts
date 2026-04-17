import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ChangePlanResponse, ConfirmPaymentArgs, CurrentPlan, GetAllPlansResponse, GetBillingHistoryParams, GetBillingHistoryResponse, MakePaymentResponse, Payment, PaymentStatus, SubscriptionPlan, TargetType, userGetAllPlansParams } from "../../../../types/subscription";
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
    payments: Payment[]
    pagination: {
        plans: {
            totalPages: number;
            totalCount: number;
        },
        payment: {
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
    payments: [],
    pagination: {
        plans: {
            totalPages: 0,
            totalCount: 0
        },
        payment: {
            totalCount: 0,
            totalPages: 0
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

export const confirmPayment = createAsyncThunk<
{success: boolean},
ConfirmPaymentArgs,
{rejectValue: string}
>('subscription/confirmPayment', async(confirmPaymentArgs, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.COMPANY.SUBSCRIPTION.CONFIRM_PAYMENT, confirmPaymentArgs)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to confirm payment')
    }
})

export const markFailure = createAsyncThunk<
{success: boolean},
{orderId: string},
{rejectValue: string}
>('subscription/markFailure', async({orderId}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.COMPANY.SUBSCRIPTION.MARK_FAILURE, {orderId})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to mark payment as failed')
    }
})

export const getBillingHistory = createAsyncThunk<
GetBillingHistoryResponse,
GetBillingHistoryParams,
{rejectValue: string}
>('subscription/billinhHistory', async(params: {status?: PaymentStatus, page: number, limit: number} | undefined, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.SUBSCRIPTION.GET_BILLING_HISTORY, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get billinh history')
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
        .addCase(confirmPayment.pending, (state) => {
            state.loading = true
        })
        .addCase(confirmPayment.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(confirmPayment.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to confirm payment'
        })
        .addCase(markFailure.pending, (state) => {
            state.loading = true
        })
        .addCase(markFailure.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(markFailure.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to mark payment as failed'
        })
        .addCase(getBillingHistory.pending, (state) => {
            state.loading = true
        })
        .addCase(getBillingHistory.fulfilled, (state, action) => {
            state.loading = false
            state.payments = action.payload.payments
            state.pagination.payment.totalCount = action.payload.totalCount
            state.pagination.payment.totalPages = action.payload.totalPages
        })
    }
})

export const { reset } = subscriptionSlice.actions
export default subscriptionSlice.reducer