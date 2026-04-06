import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { getAllQuestionsParams, getAllQuestionsResponse, Question, QuestionDifficulty, QuestionFormData, QuestionType } from "../../../../types/question";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";
import type { AxiosError } from "axios";
import type { UserRole } from "../../../../constants/role";


interface QuestionState {
    loading: boolean;
    error: string | null
    questions: Question[]
    selctedQuestion: Question | null
    pagination: {
        question: {
            totalCount: number
            totalPages: number
        }
    }
}

const initialState: QuestionState = {
    loading: true,
    questions: [],
    error: null,
    selctedQuestion: null,
    pagination:{
        question:{
            totalCount: 0,
            totalPages: 0
        }
    }
}

export const createQuestion = createAsyncThunk<
Question,
{data: QuestionFormData, role: UserRole},
{rejectValue: string}
>('question/create', async({data, role}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.COMMON.QUESTION.CREATE(role), data)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to create question')
    }
})

export const getAllQuestions = createAsyncThunk<
getAllQuestionsResponse,
getAllQuestionsParams | undefined,
{rejectValue: string}
>('question/getAll', async(params: {search?: string, category?: string, type?: QuestionType, difficulty?: QuestionDifficulty, page?: number, limit?: number} | undefined, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.TEST_QUESTIONS.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        const data = response.data.data

        return {
            questions: data.questions.map((q: Question) => q),
            totalCount: data.totalCount,
            totalPages: data.totalPages
        }
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all questions')
    }
})

export const editQuestions = createAsyncThunk<
Question,
QuestionFormData,
{rejectValue: string}
>('question/edit', async(QuestionFormData, {rejectWithValue}) => {
    try {
        const response = await api.put(API_ROUTES.ADMIN.TEST_QUESTIONS.EDIT(QuestionFormData.id), QuestionFormData)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to edit question')
    }
})

export const deleteQuestion = createAsyncThunk<
{id: string},
{id: string},
{rejectValue: string}
>('question/deleteQuestion', async({id}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.TEST_QUESTIONS.DELETE(id))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all questions')
    }
})

const questionSlice = createSlice({
    name: 'Question',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
       builder
         .addCase(createQuestion.pending, (state) => {
            state.loading = true
         })
         .addCase(createQuestion.fulfilled, (state, action) => {
            state.loading = false
            state.questions.unshift(action.payload)
         })
         .addCase(createQuestion.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to crete question'
         })
         .addCase(getAllQuestions.pending, (state) => {
            state.loading = true
         })
         .addCase(getAllQuestions.fulfilled, (state, action) => {
            state.loading = false
            state.questions = action.payload.questions.filter(q => !q.isDeleted)
            state.pagination.question.totalCount = action.payload.totalCount
            state.pagination.question.totalPages = action.payload.totalPages
         })
         .addCase(getAllQuestions.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all questions'
         })
         .addCase(editQuestions.pending, (state) => {
            state.loading = true
         })
         .addCase(editQuestions.fulfilled, (state, action) => {
            state.loading = false
            // state.selctedQuestion = action.payload
            const index = state.questions.findIndex(q => q.id === action.payload.id)
            if(index !== -1){
                state.questions[index] = action.payload
            }
         })
         .addCase(editQuestions.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to edit question'
         })
         .addCase(deleteQuestion.pending, (state) => {
            state.loading = true
         })
         .addCase(deleteQuestion.fulfilled, (state, action) => {
            state.loading = false
            state.questions = state.questions.filter(q => q.id !== action.payload.id)
         })
         .addCase(deleteQuestion.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get Question'
         })
    }
})


export const { clearError } = questionSlice.actions
export default questionSlice.reducer