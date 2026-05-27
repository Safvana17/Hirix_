import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { GetAllInterviewsParams, GetAllInterviewsResponse, Interview, ScheduleInterviewPayload } from "../../../../types/interview"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"


interface CompanyInterviewState {
    loading: boolean
    interviews: Interview[] 
    error: string | null
    pagination: {
        interview: {
            totalPages: number
            totalCount: number
        }
    }
}

const initialState: CompanyInterviewState = {
    loading: false,
    interviews: [],
    error: null,
    pagination: {
        interview: {
            totalPages: 0,
            totalCount: 0
        }
    }
}

export const scheduleInterview = createAsyncThunk<
Interview,
{data: ScheduleInterviewPayload},
{rejectValue: string}
>('interview/schedule', async({data}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.COMPANY.INTERVIEW.SCHEDULE, data)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to schedule interview')
    }
})

export const getAllInterview = createAsyncThunk<
GetAllInterviewsResponse,
{params: GetAllInterviewsParams},
{rejectValue: string}
>('interview/getAll', async({params}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.INTERVIEW.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all interviews')
    }
})

export const cancelInterview = createAsyncThunk<
void,
{id: string, reason: string},
{rejectValue: string}
>('interview/cancel', async({id, reason}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.COMPANY.INTERVIEW.CANCEL(id), {reason})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to cancel interview')
    }
})

const CompanyInterviewSlice = createSlice({
    name: 'companyInterview',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(scheduleInterview.pending, (state) => {
            state.loading = true
         })
         .addCase(scheduleInterview.fulfilled, (state, action) => {
            state.loading = false
            state.interviews.unshift(action.payload)
         })
         .addCase(scheduleInterview.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to schedule interview'
         })
         .addCase(getAllInterview.pending, (state) => {
            state.loading = true
         })
         .addCase(getAllInterview.fulfilled, (state, action) => {
            state.loading = false
            state.interviews = action.payload.interviews
            state.pagination.interview.totalCount = action.payload.totalCount
            state.pagination.interview.totalPages = action.payload.totalPages
         })
         .addCase(getAllInterview.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all interviews'
         })
         .addCase(cancelInterview.pending, (state) => {
            state.loading = true
         })
         .addCase(cancelInterview.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(cancelInterview.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to cancel interview'
         })
    }
})

export default CompanyInterviewSlice.reducer