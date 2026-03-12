import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { type UpdateStatusArgs, type Company, type FetchCompaniesParams, type FetchCompaniesResponse, type UpdateStatusPayload } from "../../../../types/company";
import type { Candidate, FetchCandidatesParams, FetchCandidatesResponse } from "../../../../types/candidate";

interface usersState {
    loading: boolean;
    error: string | null;
    candidates: Candidate[];
    companies: Company[];
    selectedCompany: Company | null;
    pagination: {
        users: {
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
        users: {totalPages: 0, totalCount: 0}
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
FetchCandidatesResponse,
FetchCandidatesParams,
{rejectValue: string}
>('admin/fetchCandidates', async(params: {search?: string; status?: string; page?: number; limit?: number} | undefined, {rejectWithValue}) => {
    try {
        const response = await api.get(`/admin/getallcandidates`, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch candidates')
    }
})

export const updateUserStatus = createAsyncThunk<
UpdateStatusPayload,
UpdateStatusArgs,
{rejectValue: string}
>('/admin/updatestatus', async(UpdateStatusArgs, {rejectWithValue}) => {
    try {
        const response = await api.patch(`/admin/${UpdateStatusArgs.role}/updatestatus/${UpdateStatusArgs.id}`,{ status: UpdateStatusArgs.status})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log(response.data)
        const updatedUser = response.data.updatedCompany || response.data.updatedCandidate
        return {
            id: updatedUser.id,
            status: updatedUser.status,
            role: updatedUser.role
        }
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data?.message || 'Failed update status')       
    }
})

export const getCompanyDetail = createAsyncThunk<
{company: Company},
{id: string},
{rejectValue: string}
>('/admin/getCompanyDetails', async({id}, {rejectWithValue}) => {
   try {
     const response = await api.get(`/admin/company/${id}`)
     if(!response){
         return rejectWithValue('Invalid response')
     }
     return response.data
   } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch company')       
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
            state.pagination.users.totalPages = action.payload.totalPages
            state.pagination.users.totalCount = action.payload.totalCount
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
            state.pagination.users.totalPages = action.payload.totalPages
            state.pagination.users.totalCount = action.payload.totalCount
          })
          .addCase(fetchCandidates.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to fetch companies'
          })
          .addCase(updateUserStatus.pending, (state) => {
            state.loading = true
            state.error = null
          })
          .addCase(updateUserStatus.fulfilled, (state, action) => {
            state.loading = false
            const {id, status, role } = action.payload
            console.log('from user slice: ', id, role, status)
            if(role === 'Company'){
                const company = state.companies.find(c => c.id === id)
                if(company) company.status = status
                if(state.selectedCompany && state.selectedCompany.id === id){
                    state.selectedCompany.status = status
                }
            }else if(role === 'Candidate'){
                const candidate = state.candidates.find(c => c.id === id)
                if(candidate) candidate.status = status
            }
          })
          .addCase(getCompanyDetail.pending, (state) => {
            state.loading = true
            state.error = null
          })
          .addCase(getCompanyDetail.fulfilled, (state, action) => {
            // console.log('selected company is: ',state.selectedCompany)
            state.loading = false
            state.selectedCompany = action.payload.company
          })
          .addCase(getCompanyDetail.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to view company profile'
          })
    }
})

export default userSlice.reducer;