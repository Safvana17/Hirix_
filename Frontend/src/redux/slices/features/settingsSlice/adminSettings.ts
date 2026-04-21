import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { TemplatePayload, EmailTemplate, GetAllTemplatesArgs, GetAllTemplatesResponse } from "../../../../types/template";
import type { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";
import type { CreateNotificationRulePayload, NotificationRule } from "../../../../types/notification";

interface AdminSettingsState {
    loading: boolean;
    templates: EmailTemplate[];
    notificationRules: NotificationRule[];
    selectedTemplate: EmailTemplate | null;
    selectedRule: NotificationRule | null;
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
    notificationRules: [],
    selectedTemplate: null,
    selectedRule: null,
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
TemplatePayload,
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

export const editEmailTemplate = createAsyncThunk<
EmailTemplate,
{data: TemplatePayload, id: string},
{rejectValue: string}
>('settings/editTemplate', async({data, id}, {rejectWithValue}) => {
    try {
        console.log('from slice data: ', data)
        const response = await api.put(API_ROUTES.ADMIN.EMAIL_TEMPLATE.EDIT(id), data)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to edit email template')
    }
})

export const createNotificationRule = createAsyncThunk<
void,
CreateNotificationRulePayload,
{rejectValue: string}
>('settings/createRule', async(CreateNotificationPayload, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.ADMIN.NOTIFICATION_RULE.CREATE, CreateNotificationPayload)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to create notification rule')
    }
})

export const getAllRules = createAsyncThunk<
NotificationRule[],
void,
{rejectValue: string}
>('settings/getAllRules', async(_, {rejectWithValue}) => {
    try {
        console.log('from slice: ', createEmailTemplate)
        const response = await api.get(API_ROUTES.ADMIN.NOTIFICATION_RULE.GET_ALL)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log('from slice rule: ', response.data)
        return response.data.data.rules
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all notification rules')
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
         .addCase(editEmailTemplate.pending, (state) => {
            state.loading = true
         })
         .addCase(editEmailTemplate.fulfilled, (state, action) => {
            state.loading = false
            const index = state.templates.findIndex(t => t.id === action.payload.id)
            if(index != -1){
                state.templates[index] = action.payload
            }
         })
         .addCase(createNotificationRule.pending, (state) => {
            state.loading = true
         })
         .addCase(createNotificationRule.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(createNotificationRule.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to create notification rule'
         })
         .addCase(getAllRules.pending, (state) => {
            state.loading = true
         })
         .addCase(getAllRules.fulfilled, (state, action) => {
            state.loading = false
            state.notificationRules = action.payload
         })
         .addCase(getAllRules.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all rules'
         })
    },
})

export default adminSettingsSlice.reducer