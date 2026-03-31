import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { createJobRolePayload, getAllJobRolesParams, GetAllJobRolesResponse, JobRole } from "../../../../types/jobRole";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";
import type { AxiosError } from "axios";


interface jobRoleState {
    loading: boolean;
    error: string | null;
    jobRoles: JobRole[]
    selectedJobRole: JobRole | null;
    pagination: {
        jobRole: {
            totalPages: number;
            totalCount: number
        }
    }
}

const initialState: jobRoleState = {
    loading: true,
    error: null,
    jobRoles: [],
    selectedJobRole: null,
    pagination: {
        jobRole: {
            totalPages: 0,
            totalCount: 0
        }
    }
}

export const createJobRole = createAsyncThunk<
void,
createJobRolePayload,
{rejectValue: string}
>('company/createJobRole', async(createJobRolePayload, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.COMPANY.JOB_ROLE, createJobRolePayload)
        if(!response.data.success){
            return rejectWithValue('Invalid Response')
        }

        return response.data
    } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to create job role')  
    }
})

export const getAllJobRoles = createAsyncThunk <
GetAllJobRolesResponse,
getAllJobRolesParams | undefined,
{rejectValue: string}
>('jobrole/getAllJobRole', async(params: {search?: string; status?: string; page?: number; limit?: number} | undefined, {rejectWithValue} )=> {
    try {
        const response = await api.get(API_ROUTES.COMPANY.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid Response')
        }
        return response.data
    } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to get all job roles')        
    }
})

const jobRoleSlice = createSlice({
    name: 'JobRole',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
         .addCase(createJobRole.pending, (state) => {
            state.loading = true
         })
         .addCase(createJobRole.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(createJobRole.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to add job role'
         })
         .addCase(getAllJobRoles.pending, (state) => {
            state.loading = true
         })
         .addCase(getAllJobRoles.fulfilled, (state, action) => {
            state.loading = false
            state.jobRoles = action.payload.jobRoles
            state.pagination.jobRole.totalCount = action.payload.totalCount
            state.pagination.jobRole.totalPages = action.payload.totalPages
         })
         .addCase(getAllJobRoles.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to fetch job roles'
         })
    }  
})

export const { clearError } = jobRoleSlice.actions
export default jobRoleSlice.reducer 