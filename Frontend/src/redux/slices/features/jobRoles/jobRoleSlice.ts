import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { createJobRolePayload, JobRole } from "../../../../types/jobRole";
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
    }  
})

export const { clearError } = jobRoleSlice.actions
export default jobRoleSlice.reducer 