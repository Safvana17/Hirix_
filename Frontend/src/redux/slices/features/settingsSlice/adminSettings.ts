import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CreateTemplatePayload, EmailTemplate, GetAllTemplatesArgs, GetAllTemplatesResponse } from "../../../../types/template";
import type { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";

interface AdminSettingsState {
    loading: boolean;
    templates: EmailTemplate[];
    selectedTemplate: EmailTemplate[] | null;
    error: string | null;
    pagination: {
        templates: {
            totalPages: number;
            totalCount: number
        }
    }
}

const initialState: AdminSettingsState = {
    loading: true,
    templates: [],
    selectedTemplate: null,
    error: null,
    pagination: {
        templates: {
            totalPages: 0,
            totalCount: 0
        }
    }
}


export const createEmailTemplate = createAsyncThunk<
void,
CreateTemplatePayload,
{rejectValue: string}
>('settings/createTemplate', async(createEmailTemplate, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.ADMIN.EMAIL_TEMPLATE.CREATE, createEmailTemplate)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to create email template')
    }
})

export const getAllTemplates = createAsyncThunk<
GetAllTemplatesResponse,
{params: GetAllTemplatesArgs},
{rejectValue: string}
>('settings/getAllTemplate', async({params}, {rejectWithValue}) => {
    try {
        console.log('from slice: ', createEmailTemplate)
        const response = await api.get(API_ROUTES.ADMIN.EMAIL_TEMPLATE.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log('from slice: ', response.data)
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all email templates')
    }
})



const adminSettingsSlice = createSlice({
    name: 'AdminSettings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
         .addCase(createEmailTemplate.pending, (state) => {
            state.loading = true
         })
         .addCase(createEmailTemplate.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(createEmailTemplate.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to create email template'
         })
         .addCase(getAllTemplates.pending, (state) => {
            state.loading = true
         })
         .addCase(getAllTemplates.fulfilled, (state, action) => {
            state.loading = false
            state.templates = action.payload.templates
            state.pagination.templates.totalPages = action.payload.totalPages
            state.pagination.templates.totalCount = action.payload.totalCount
         })
         .addCase(getAllTemplates.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all templates'
         })
    },
})

export default adminSettingsSlice.reducer