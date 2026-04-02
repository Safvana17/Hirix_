import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type DeleteJobRoleResponse, type createJobRolePayload, type editJobRolePayload, type getAllJobRolesParams, type GetAllJobRolesResponse, type JobRole, type UpdateJobRoleStatusArgs, type UpdateJobRoleStatusPayload } from "../../../../types/jobRole";
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
JobRole,
createJobRolePayload,
{rejectValue: string}
>('company/createJobRole', async(createJobRolePayload, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.COMPANY.JOB_ROLE, createJobRolePayload)
        if(!response.data.success){
            return rejectWithValue('Invalid Response')
        }

        return response.data.jobRole
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
        const response = await api.get(API_ROUTES.COMPANY.GET_ALL_JOBROLE, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid Response')
        }
        return response.data
    } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to get all job roles')        
    }
})

export const editJobRole = createAsyncThunk<
JobRole,
editJobRolePayload,
{rejectValue: string}
>('jobrole/edit', async({id, name, skills, experienceMin, experienceMax, openings}, {rejectWithValue}) => {
    try {
        const response = await api.put(API_ROUTES.COMPANY.EDIT_JOBROLE(id), {name, skills, experienceMin, experienceMax, openings} )
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.updatedJobRole
    } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to edit job role')         
    }
})

export const updateJobRoleStatus = createAsyncThunk<
UpdateJobRoleStatusPayload,
UpdateJobRoleStatusArgs,
{rejectValue: string}
>('jobrole/updateStatus', async(UpdateJobRoleStatusArgs, {rejectWithValue}) => {
    try {
        const response = await api.put(API_ROUTES.COMPANY.JOBROLE_STATUS(UpdateJobRoleStatusArgs.id), {status: UpdateJobRoleStatusArgs.status})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return {
            id: response.data.updatedJobRole.id,
            status: response.data.updatedJobRole.status
        }
    } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to update status of job role')        
    }
})

export const deleteJobRole = createAsyncThunk<
DeleteJobRoleResponse,
{id: string},
{rejectValue: string}
>('jobRole/delete', async({id}, {rejectWithValue}) => {
    try {
        const response = await api.delete(API_ROUTES.COMPANY.DELETE_JOB_ROLE(id))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return {
            id : response.data.updatedJobRole.id
        }
    } catch (error) {
       const err = error as AxiosError<{message: string}>
       return rejectWithValue(err.response?.data?.message || 'Failed to delete job role')        
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
         .addCase(createJobRole.fulfilled, (state, action) => {
            state.loading = false
            state.jobRoles.unshift(action.payload)
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
            state.jobRoles = action.payload.jobRoles.filter((role) => 
              role.status !== 'Deleted'
            )
            state.pagination.jobRole.totalCount = action.payload.totalCount
            state.pagination.jobRole.totalPages = action.payload.totalPages
         })
         .addCase(getAllJobRoles.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to fetch job roles'
         })
         .addCase(editJobRole.pending, (state) => {
            state.loading = true
         })
         .addCase(editJobRole.fulfilled, (state, action) => {
            state.loading = false
            const index = state.jobRoles.findIndex((c) => c.id === action.payload.id)
            if(index !== -1){
                state.jobRoles[index] = action.payload
            }
         })
         .addCase(editJobRole.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to edit job role'
         })
         .addCase(updateJobRoleStatus.pending, (state) => {
            state.loading = true
         })
         .addCase(updateJobRoleStatus.fulfilled, (state, action) => {
            state.loading = false
            const {id, status} = action.payload
            const role = state.jobRoles.find(c => c.id === id)
            if(role){
                role.status = status
            }
         })
         .addCase(updateJobRoleStatus.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Faile to update job role status'
         })
         .addCase(deleteJobRole.pending, (state) => {
            state.loading = true
         })
         .addCase(deleteJobRole.fulfilled, (state, action) => {
            state.loading = false
            state.jobRoles = state.jobRoles.filter((role) => role.id !== action.payload.id)
         })
    }  
})

export const { clearError } = jobRoleSlice.actions
export default jobRoleSlice.reducer 