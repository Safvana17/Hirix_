import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { CandidateProfileForm, ChangePassword, InterviewHistory, InterviewHistoryArgs, InterviewHistoryResponse, UpdateCandidateProfile } from "../../../../types/candidate"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"
import type { AxiosError } from "axios"


interface CandidateInitialState {
    loading: boolean
    error: string | null
    interviewHistory: InterviewHistory[]
    candidate: CandidateProfileForm | null
    pagination: {
      history: {
        totalPages: number
        totalCount: number
      }
    }

}

const initialState: CandidateInitialState = {
    loading: false,
    error: null,
    interviewHistory: [],
    candidate: null,
    pagination: {
      history: {
        totalCount: 0,
        totalPages: 0
      }
    }
}

export const changePassword = createAsyncThunk<
void,
ChangePassword,
{rejectValue: string}
>('settings/changePasssword', async({id, oldPassword, newPassword, confirmPassword}, {rejectWithValue}) => {
  try {
    const response = await api.put(API_ROUTES.CANDIDATE.SETTINGS.CHANGE_PASSWORD(id), {oldPassword, newPassword, confirmPassword})
    if(!response.data.success){
      return rejectWithValue('Invalid response')
    }

    return response.data.data
  } catch (error) {
    const err = error as AxiosError<{ message: string }>
    return rejectWithValue(err.response?.data?.message || 'Failed to change password')
  }
})

export const getInterviewHistory = createAsyncThunk<
InterviewHistoryResponse,
{params: InterviewHistoryArgs},
{rejectValue: string}
>('interview/history', async ({params}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.CANDIDATE.SETTINGS.INTERVIEW_HISTORY, {params})
        if(!response.data.success){
            return rejectWithValue("Invalid response")
        }
        console.log('response: ', response.data.data)
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get interview history')
    }
})

export const updateProfile = createAsyncThunk<
void,
{id: string, candidate: UpdateCandidateProfile},
{rejectValue: string}
> ('candidate/updateProfile', async({id, candidate}, {rejectWithValue}) => {
   try {
     const response = await api.put(API_ROUTES.CANDIDATE.SETTINGS.PROFILE(id), candidate)
 
     if(!response.data.success){
         return rejectWithValue('Invalid response')
     }
 
     return response.data.data
   } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to update candidate profile')       
   }
})

export const getCandidateProfile = createAsyncThunk<
CandidateProfileForm,
{id: string},
{rejectValue: string}
>('candidate/getProfile', async({id}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.CANDIDATE.SETTINGS.PROFILE(id))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log('candidate', response.data.data)
        return response.data.data
    } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to get candidate profile')        
    }
})

const candidateSettingsSlice = createSlice({
    name: 'CandidateSettings',
    initialState,
    reducers: {},
    extraReducers: (build) => 
        build
         .addCase(changePassword.pending, (state) => {
            state.loading = true
         })
         .addCase(changePassword.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(changePassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to change password'
         })
         .addCase(getInterviewHistory.pending, (state) => {
          state.loading = true
         })
         .addCase(getInterviewHistory.fulfilled, (state, action) => {
          state.loading = false
          state.interviewHistory = action.payload.history
          state.pagination.history.totalCount = action.payload.totalCount
          state.pagination.history.totalPages = action.payload.totalPages
         })
         .addCase(getInterviewHistory.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload || 'Failed to get interview history'
         })
         .addCase(updateProfile.pending, (state) => {
          state.loading = true
         })
         .addCase(updateProfile.fulfilled, (state) => {
          state.loading = false
         })
         .addCase(updateProfile.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload || 'Failed to update candidate profile'
         })
         .addCase(getCandidateProfile.pending, (state) => {
          state.loading = true
         })
         .addCase(getCandidateProfile.fulfilled, (state, action) => {
          state.loading = false
          state.candidate = action.payload
         })
         .addCase(getCandidateProfile.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload || 'Failed to get candidate profile'
         })
})

export default candidateSettingsSlice.reducer