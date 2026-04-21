import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CreateTemplatePayload, EmailTemplate } from "../../../../types/template";
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
            totalPges: number;
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
            totalPges: 0,
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
        console.log('from slice: ', createEmailTemplate)
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
    },
})

export default adminSettingsSlice.reducer