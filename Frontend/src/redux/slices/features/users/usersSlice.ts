import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../../../lib/axios";
import type { Company, FetchCompaniesParams, FetchCompaniesResponse } from "../../../../types/company";
import type { Candidate } from "../../../../types/candidate";

interface usersState {
    loading: boolean;
    error: string | null;
    candidates: Candidate[];
    companies: Company[];
    selectedCompany: Company | null;
    pagination: {
        companies: {
            totalPages: number;
            totalCount: number
        }
    }
}

const initialState: usersState = {
    loading: false,
    error: null,
    candidates: [],
    companies: [],
    selectedCompany: null,
    pagination: {
        companies: {totalPages: 0, totalCount: 0}
    }
}

export const fetchCompanies = createAsyncThunk<
FetchCompaniesResponse,
FetchCompaniesParams | undefined,
{rejectValue: string}
>('admin/fetchCompanies', async(params: {search?: string; status?: string; page?: number; limit?: number} | undefined, {rejectWithValue}) => {
    try {
        const response = await api.get(`/admin/getallcompanies`, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data
    } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Failed to fetch companies')
    }
})

export const fetchCandidates = createAsyncThunk<
{candidates: Candidate[]},
void,
{rejectValue: string}
>('admin/fetchCandidates', async(_, {rejectWithValue}) => {
    try {
        const response = await api.get(`/admin/getallcandidates`)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch candidates')
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
            state.pagination.companies.totalPages = action.payload.totalPages
            state.pagination.companies.totalCount = action.payload.totalCount
          })
          .addCase(fetchCompanies.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'FAILED TO FETCH COMPANIES'
          })
          .addCase(fetchCandidates.pending, (state) => {
            state.loading = true
            state.error = null
          })
          .addCase(fetchCandidates.fulfilled, (state, action) => {
            state.loading = false
            state.candidates = action.payload.candidates
          })
          .addCase(fetchCandidates.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to fetch companies'
          })
    }
})

export default userSlice.reducer;