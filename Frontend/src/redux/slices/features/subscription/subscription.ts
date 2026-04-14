import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PlanPayload, getAllPlansParams, GetAllPlansResponse, SubscriptionPlan, TargetType, UpdatePlanStatusPayload } from "../../../../types/subscription";
import type { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";


interface SubscriptionState {
    loading: boolean;
    error: string | null;
    plans: SubscriptionPlan[];
    selectedPlan: SubscriptionPlan | null
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
    selectedPlan: null,
    pagination: {
        plans: {
            totalPages: 0,
            totalCount: 0
        }
    }
}

export const createPlan = createAsyncThunk<
SubscriptionPlan,
{data: PlanPayload},
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

export const getAllPlans = createAsyncThunk<
GetAllPlansResponse,
getAllPlansParams | undefined,
{rejectValue: string}
>('subscription/getAllPlans', async(params: { target?: TargetType, page?: number, limit?: number} | undefined, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.SUBSCRIPTION_PLAN.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all plans')
    }
})

export const editPlan = createAsyncThunk<
SubscriptionPlan,
{data: PlanPayload},
{rejectValue: string}
>('subscription/editPlan', async({data}, {rejectWithValue}) =>{
    try {
        const response = await api.put(API_ROUTES.ADMIN.SUBSCRIPTION_PLAN.EDIT(data.id), data)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to edit subscription plan')
    }
})

export const updateStatus = createAsyncThunk<
{id: string, status: boolean},
UpdatePlanStatusPayload,
{rejectValue: string}
>('subscription/deletePlan', async({id, status}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.ADMIN.SUBSCRIPTION_PLAN.STATUS(id), {status})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to update plan status')
    }
})

export const deletePlan = createAsyncThunk<
{id: string},
{id: string},
{rejectValue: string}
>('subscription/updateStatus', async({id}, {rejectWithValue}) => {
    try {
        const response = await api.delete(API_ROUTES.ADMIN.SUBSCRIPTION_PLAN.DELETE(id))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to update plan status')
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
        .addCase(editPlan.pending, (state) => {
            state.loading = true
        })
        .addCase(editPlan.fulfilled, (state, action) => {
            state.loading = false
            state.selectedPlan = action.payload
        })
        .addCase(editPlan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to edit plan'
        })
        .addCase(updateStatus.pending, (state) => {
            state.loading = true
        })
        .addCase(updateStatus.fulfilled, (state, action) => {
            state.loading = false
            const {id, status } = action.payload
            const plan = state.plans.find(p => p.id === id)
            if(plan){
                plan.isActive = status
            }
        })
        .addCase(updateStatus.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to update status'
        })
        .addCase(deletePlan.pending, (state) => {
            state.loading = true
        })
        .addCase(deletePlan.fulfilled, (state, action) => {
            state.loading = false
            state.plans = state.plans.filter(p => p.id !== action.payload.id)
        })
    }
})

export const { reset } = subscriptionSlice.actions
export default subscriptionSlice.reducer