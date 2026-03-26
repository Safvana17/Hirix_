import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CompanySettings, UpdateCompanyProfilePayload } from "../../../../types/company";
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
    }
})

export const {clearError} = CompanySettingsSlice.actions
export default CompanySettingsSlice.reducer