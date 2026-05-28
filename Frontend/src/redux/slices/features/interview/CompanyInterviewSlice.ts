import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { GetAllInterviewsParams, GetAllInterviewsResponse, Interview, RescheduleInterviewArgs, ScheduleInterviewPayload } from "../../../../types/interview"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"


interface CompanyInterviewState {
    loading: boolean
    interviews: Interview[] 
    selectedInterview: Interview | null
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
    selectedInterview: null,
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

export const rescheduleInterview = createAsyncThunk<
void,
RescheduleInterviewArgs,
{rejectValue: string}
>('interview/reschedule', async(RescheduleInterviewArgs, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.COMPANY.INTERVIEW.RESCHEDULE(RescheduleInterviewArgs.id), {startTime: RescheduleInterviewArgs.startTime, endTime: RescheduleInterviewArgs.endTime})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to reschedule interview')
    }
})

export const getInterviewById = createAsyncThunk<
Interview,
{id: string},
{rejectValue: string}
>('interview/getById', async({id}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.INTERVIEW.GET_BY_ID(id))
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get interview')
    }
})

export const editInterview = createAsyncThunk<
void,
{data: ScheduleInterviewPayload, id: string},
{rejectValue: string}
>('interview/edit', async({data, id}, {rejectWithValue}) => {
    try {
        const response = await api.put(API_ROUTES.COMPANY.INTERVIEW.EDIT(id), data)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to edit interview')
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
         .addCase(rescheduleInterview.pending, (state) => {
            state.loading = true
         })
         .addCase(rescheduleInterview.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(rescheduleInterview.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to reschedule interview'
         })
         .addCase(getInterviewById.pending, (state) => {
            state.loading = true
         })
         .addCase(getInterviewById.fulfilled, (state, action) => {
            state.loading = false
            state.selectedInterview = action.payload
         })
         .addCase(getInterviewById.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to get interview'
         })
         .addCase(editInterview.pending, (state) => {
            state.loading = true
         })
         .addCase(editInterview.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(editInterview.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to edit interview'
         })
    }
})

export default CompanyInterviewSlice.reducer