import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { type UpdateStatusArgs, type Company, type FetchCompaniesParams, type FetchCompaniesResponse, type UpdateStatusPayload, type ApproveCompanyArgs, type RejectCompanyArgs, type CompanySettings } from "../../../../types/company";
import type { Candidate, FetchCandidatesParams, FetchCandidatesResponse } from "../../../../types/candidate";
import { API_ROUTES } from "../../../../constants/api.routes";
import { ROLES } from "../../../../constants/role";

interface usersState {
    loading: boolean;
    error: string | null;
    candidates: Candidate[];
    companies: Company[];
    selectedCompany: CompanySettings | null;
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
        const response = await api.get(API_ROUTES.ADMIN.COMPANIES.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
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
        const response = await api.get(API_ROUTES.ADMIN.CANDIDATES.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
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
        const route = UpdateStatusArgs.role === ROLES.COMPANY
              ? API_ROUTES.ADMIN.COMPANIES.STATUS(UpdateStatusArgs.id)
              : API_ROUTES.ADMIN.CANDIDATES.STATUS(UpdateStatusArgs.id)

        const response = await api.patch(route,{ status: UpdateStatusArgs.status})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log(response.data)
        const updatedUser = response.data.data || response.data.data
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

export const approveCompany = createAsyncThunk<
UpdateStatusPayload,
ApproveCompanyArgs,
{rejectValue: string}
>('/admin/approve', async(ApproveCompanyArgs, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.ADMIN.COMPANIES.APPROVE(ApproveCompanyArgs.id))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log(response.data)
        return {
            id: response.data.data.id,
            status: response.data.data.status,
            role: response.data.data.role
        }
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data?.message || 'Failed approve company')       
    }
})

export const rejectCompany = createAsyncThunk<
UpdateStatusPayload,
RejectCompanyArgs,
{rejectValue: string}
>('/admin/reject', async(RejectCompanyArgs, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.ADMIN.COMPANIES.REJECT(RejectCompanyArgs.id),{ reason: RejectCompanyArgs.reason})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log(response.data)
       
        return {
            id: response.data.data.id,
            status: response.data.data.status,
            role: response.data.data.role
        }
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data?.message || 'Failed Reject company')       
    }
})

export const getCompanyDetail = createAsyncThunk<
{company: CompanySettings},
{id: string},
{rejectValue: string}
>('/admin/getCompanyDetails', async({id}, {rejectWithValue}) => {
   try {
     const response = await api.get(API_ROUTES.ADMIN.COMPANIES.BY_ID(id))
     if(!response){
         return rejectWithValue('Invalid response')
     }
     return { company: response.data.data}
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
          .addCase(approveCompany.pending, (state) => {
            state.loading = true
            state.error = null
          })
          .addCase(approveCompany.fulfilled, (state, action) => {
            state.loading = false
            const {id, status} = action.payload
            const company = state.companies.find(c => c.id === id)
            if(company){
                company.status = status
                company.isAdminVerified = true
            }
            if(state.selectedCompany && state.selectedCompany.id === id){
                state.selectedCompany.status = status
                state.selectedCompany.isAdminVerified = true
            }
          })
          .addCase(approveCompany.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to approve company'
          })
          .addCase(rejectCompany.pending, (state) => {
            state.loading = true
          })
          .addCase(rejectCompany.fulfilled, (state, action) => {
            state.loading = false
            const {id, status} = action.payload
            const company = state.companies.find(c => c.id === id)
            if(company){
                company.status = status
                company.isAdminVerified = false
            }
            if(state.selectedCompany && state.selectedCompany.id === id){
                state.selectedCompany.status = status
                state.selectedCompany.isAdminVerified = false
            }
          })
          .addCase(rejectCompany.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to approve company'
          })
    }
})

export default userSlice.reducer;