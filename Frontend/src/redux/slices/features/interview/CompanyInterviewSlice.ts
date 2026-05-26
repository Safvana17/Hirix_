import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { Interview, ScheduleInterviewPayload } from "../../../../types/interview"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"

interface CompanyInterviewState {
    loading: boolean
    interviews: Interview[] 
    error: string | null
}

const initialState: CompanyInterviewState = {
    loading: false,
    interviews: [],
    error: null
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
    }
})

export default CompanyInterviewSlice.reducer