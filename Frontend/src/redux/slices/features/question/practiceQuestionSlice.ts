import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { getAllQuestionsParams, getAllQuestionsResponse, PracticeQuestion, PracticeResultResponse, PracticeSubmitAnswerData, Question } from "../../../../types/question";
import type { UserRole } from "../../../../constants/role";
import type { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";

interface PracticeQuestionState {
    PracticeQuestions: Question[];
    error: string | null;
    loading: boolean;
    selectedPracticeQuestion: PracticeQuestion | null;
    pagination: {
        PracticeQuestion: {
            totalCount: number;
            totalPages: number
        }
    }
}

const initialState: PracticeQuestionState = {
    PracticeQuestions: [],
    loading: true,
    error: null,
    selectedPracticeQuestion: null,
    pagination: {
        PracticeQuestion: {
            totalCount: 0,
            totalPages: 0
        }
    }
}

export const getAllPracticeQuestions = createAsyncThunk<
getAllQuestionsResponse,
{params: getAllQuestionsParams | undefined, role: UserRole},
{rejectValue: string}
>('practiceQuestions/getAll', async({params, role}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.PRACTICE_QUESTION.GET_ALL(role), {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        console.log('response from slice: ', response)
        return {
            questions: response.data.data.practiceQuestions.map((q:Question) => q),
            totalCount: response.data.data.totalCount,
            totalPages: response.data.data.totalPages
        }
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all practice questions')
    }
})

export const getQuestionById = createAsyncThunk<
PracticeQuestion,
{questionId: string},
{rejectValue: string}
>('practiceQuestions/getById', async({questionId}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.CANDIDATE.PRACTICE.GET_BY_ID(questionId))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data.question
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get practice question')
    }
})

export const getRelatedQuestions = createAsyncThunk<
Question[],
{questionId: string},
{rejectValue: string}
>('practiceQuestions/getRelated', async({questionId}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.CANDIDATE.PRACTICE.GET_RELATED(questionId))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get related practice questions')
    }
})

export const submitAnswer = createAsyncThunk<
PracticeResultResponse,
{questionId: string, data: PracticeSubmitAnswerData},
{rejectValue: string}
>('practiceQuestions/submit', async({questionId, data}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.CANDIDATE.PRACTICE.SUBMIT(questionId), data)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to submit answer')
    }
})

const PraticeQuestionSlice = createSlice({
    name: 'PracticeQuestion',
    initialState,
    reducers: {
        reset: (state) => {
            state.PracticeQuestions = []
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
         .addCase(getAllPracticeQuestions.pending, (state) => {
            state.loading = true
         })
         .addCase(getAllPracticeQuestions.fulfilled, (state, action) => {
            state.loading = false
            state.PracticeQuestions = action.payload.questions.filter(q => !q.isDeleted)
            state.pagination.PracticeQuestion.totalCount = action.payload.totalCount
            state.pagination.PracticeQuestion.totalPages = action.payload.totalPages
         })
         .addCase(getAllPracticeQuestions.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all practice questions'
         })
         .addCase(getQuestionById.pending, (state) => {
            state.loading = true
         })
         .addCase(getQuestionById.fulfilled, (state, action) => {
            state.loading = false
            state.selectedPracticeQuestion = action.payload
         })
         .addCase(getQuestionById.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get practice question'
         })
         .addCase(getRelatedQuestions.pending, (state) => {
            state.loading = true
         })
         .addCase(getRelatedQuestions.fulfilled, (state, action) => {
            state.loading = false
            state.PracticeQuestions = action.payload
         })
         .addCase(getRelatedQuestions.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get related practice questions'
         })
         .addCase(submitAnswer.pending, (state) => {
            state.loading = true
         })
         .addCase(submitAnswer.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(submitAnswer.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to submit answer'
         })
    }
})

export const { reset } = PraticeQuestionSlice.actions
export default PraticeQuestionSlice.reducer