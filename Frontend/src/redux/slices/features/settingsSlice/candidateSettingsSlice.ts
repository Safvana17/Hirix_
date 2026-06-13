import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { ChangePassword } from "../../../../types/candidate"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"
import type { AxiosError } from "axios"


interface CandidateInitialState {
    loading: boolean
    error: string | null

}

const initialState: CandidateInitialState = {
    loading: false,
    error: null
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
})

export default candidateSettingsSlice.reducer