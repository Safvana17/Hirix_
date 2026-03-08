import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../../../lib/axios";
import type { Company } from "../../../../types/company";

interface usersState {
    loading: boolean;
    error: string | null;
    candidates: Company[];
    companies: Company[]
}

const initialState: usersState = {
    loading: false,
    error: null,
    candidates: [],
    companies: []
}

export const fetchCompanies = createAsyncThunk<
{companies: Company[]},
void,
{rejectValue: string}
>('admin/fetchCompanies', async(_, {rejectWithValue}) => {
    try {
        const response = await api.get(`/admin/getallcompanies`)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data
    } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Failed to fetch companies')
    }
})

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchCompanies.pending, (state) => {
            state.loading = true
          })
          .addCase(fetchCompanies.fulfilled, (state, action) => {
            state.loading = false
            state.companies = action.payload.companies
          })
          .addCase(fetchCompanies.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'FAILED TO FETCH COMPANIES'
          })
    }
})

export default userSlice.reducer;