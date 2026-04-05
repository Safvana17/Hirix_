import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { getAllQuestionsParams, getAllQuestionsResponse, Question, QuestionDifficulty, QuestionFormData, QuestionType } from "../../../../types/question";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";
import type { AxiosError } from "axios";


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
QuestionFormData,
{rejectValue: string}
>('question/create', async(createQuestionPayload, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.ADMIN.TEST_QUESTIONS.CREATE, createQuestionPayload)
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

        console.log('response from question ', response.data.data)
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
            state.questions = action.payload.questions
            state.pagination.question.totalCount = action.payload.totalCount
            state.pagination.question.totalPages = action.payload.totalPages
         })
         .addCase(getAllQuestions.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all questions'
         })
    }
})


export const { clearError } = questionSlice.actions
export default questionSlice.reducer