import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { GetAllInterviewsParams, GetAllInterviewsResponse, GetInterviewAccessResponse, Interview, RescheduleInterviewArgs, ScheduleInterviewPayload, UpdateInterviewResultArgs } from "../../../../types/interview"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"


interface CompanyInterviewState {
    loading: boolean
    interviews: Interview[] 
    selectedInterview: Interview | null
    error: string | null
    canJoin: boolean
    accessInterview: GetInterviewAccessResponse | null
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
    canJoin: false,
    accessInterview: null,
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

export const getInterviewAccess = createAsyncThunk<
GetInterviewAccessResponse,
{token: string, roomId: string},
{rejectValue: string}
>('interview/getAccess', async({token, roomId}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMMON.INTERVIEW.GET_ACCESS(roomId, token))
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get interview access')
    }
})

export const joinInterview = createAsyncThunk<
boolean,
{token: string, roomId: string},
{rejectValue: string}
>('interview/join', async({token, roomId}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.COMMON.INTERVIEW.JOIN(roomId, token))
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to join interview')
    }
})

export const endInterview = createAsyncThunk<
Interview,
{token: string, roomId: string},
{rejectValue: string}
>('interview/end', async({token, roomId}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.COMMON.INTERVIEW.END(roomId, token))
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to end interview')
    }
})

export const updateInterviewResult = createAsyncThunk<
void,
{interviewId: string, data: UpdateInterviewResultArgs},
{rejectValue: string}
>('interview/result', async({interviewId, data}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.COMPANY.INTERVIEW.UPDATE_RESULT(interviewId), data)
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to update interview result')
    }
})

export const sendOfferLetter = createAsyncThunk<
void,
{interviewId: string},
{rejectValue: string}
>('interview/offer', async({interviewId}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.COMPANY.INTERVIEW.SEND_OFFER_LETTER(interviewId))
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to send offer letter')
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
         .addCase(getInterviewAccess.pending, (state) => {
            state.loading = true
         })
         .addCase(getInterviewAccess.fulfilled, (state, action) => {
            state.loading = false
            state.accessInterview = action.payload
         })
         .addCase(getInterviewAccess.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to get interview access'
         })
         .addCase(joinInterview.pending, (state) => {
            state.loading = true
         })
         .addCase(joinInterview.fulfilled, (state, action) => {
            state.loading = false
            state.canJoin = action.payload
            // state.accessInterview = action.payload
         })
         .addCase(joinInterview.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to join interview'
         })
         .addCase(endInterview.pending, (state) => {
            state.loading = true
         })
         .addCase(endInterview.fulfilled, (state, action) => {
            state.loading = false
            state.selectedInterview = action.payload
         })
         .addCase(endInterview.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to end interview'
         })
         .addCase(updateInterviewResult.pending, (state) => {
            state.loading = true
         })
         .addCase(updateInterviewResult.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(updateInterviewResult.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to update interview result'
         })
         .addCase(sendOfferLetter.pending, (state) => {
            state.loading = true
         })
         .addCase(sendOfferLetter.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(sendOfferLetter.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to send offer letter'
         })
    }
})

export default CompanyInterviewSlice.reducer