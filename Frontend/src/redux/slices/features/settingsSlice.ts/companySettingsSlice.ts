import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { changePasswordPayload, CompanySettings, deleteAccountPayload, UpdateCompanyProfilePayload } from "../../../../types/company";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";
import type { AxiosError } from "axios";

interface settingsState {
    loading: boolean;
    error: string | null;
    company: CompanySettings | null
}

const initialState: settingsState = {
    company: null,
    loading: false,
    error: null
}

export const updateProfile = createAsyncThunk<
{company: CompanySettings},
{id: string, company: UpdateCompanyProfilePayload},
{rejectValue: string}
> ('settings/updateProfile', async({id, company}, {rejectWithValue}) => {
   try {
     const response = await api.put(API_ROUTES.COMPANY.PROFILE(id), company)
 
     if(!response.data.success){
         return rejectWithValue('Invalid response')
     }
 
     return {company: response.data.company}
   } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to update company profile')       
   }
})

export const getCompanyProfile = createAsyncThunk<
{company: CompanySettings},
{id: string},
{rejectValue: string}
>('settings/getProfile', async({id}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.PROFILE(id))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return {company: response.data.company}
    } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to get company profile')        
    }
})

export const uploadProfileImage = createAsyncThunk<
{company: CompanySettings},
{id: string, formData: FormData},
{rejectValue: string}
>('settings/uploadImage', async({id, formData}, {rejectWithValue}) => {
   try {
     const response = await api.put(API_ROUTES.COMPANY.PROFILE_LOGO(id), 
        formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
     if(!response.data.success){
       return rejectWithValue('Invalid response')
     }
 
     return { company: response.data.company}
   } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to upload profile logo')     
   }
})

export const changePassword = createAsyncThunk<
void,
changePasswordPayload,
{rejectValue: string}
>('settings/changePasssword', async({id, oldPassword, newPassword, confirmPassword}, {rejectWithValue}) => {
  try {
    const response = await api.put(API_ROUTES.COMPANY.PASSWORD(id), {oldPassword, newPassword, confirmPassword})
    if(!response.data.success){
      return rejectWithValue('Invalid response')
    }

    return
  } catch (error) {
    const err = error as AxiosError<{ message: string }>
    return rejectWithValue(err.response?.data?.message || 'Failed to change password')
  }
})

export const deleteAccount = createAsyncThunk<
void,
deleteAccountPayload,
{rejectValue: string}
>('settings/deleteAccount', async({id, reason, feedback, password}, {rejectWithValue}) => {
  try {
    const response = await api.put(API_ROUTES.COMPANY.ACCOUNT(id), {reason, feedback, password})
    if(!response.data.success){
      return rejectWithValue('Invalid response')
    }

    return
  } catch (error) {
    const err = error as AxiosError<{message: string}>
    return rejectWithValue(err.response?.data.message || 'Failed to delete account')
  }
})

const CompanySettingsSlice = createSlice({
    name: 'companySettings',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(updateProfile.pending, (state) => {
            state.loading = true
          })
          .addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false
            state.company = action.payload.company
          })
          .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to update profile'
          })
          .addCase(getCompanyProfile.pending, (state) => {
            state.loading = true
          })
          .addCase(getCompanyProfile.fulfilled, (state, action) => {
            state.loading = false
            state.company = action.payload.company
          })
          .addCase(getCompanyProfile.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to load company profile'
          })
          .addCase(uploadProfileImage.pending, (state) => {
            state.loading = true
          })
          .addCase(uploadProfileImage.fulfilled, (state, action) => {
            state.loading = false
            state.company = action.payload.company
          })
          .addCase(uploadProfileImage.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to upload image'
          })
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
          .addCase(deleteAccount.pending, (state) => {
            state.loading = true
          })
          .addCase(deleteAccount.fulfilled, (state) => {
            state.loading = false
          })
          .addCase(deleteAccount.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to delete account'
          })
    }
})

export const {clearError} = CompanySettingsSlice.actions
export default CompanySettingsSlice.reducer