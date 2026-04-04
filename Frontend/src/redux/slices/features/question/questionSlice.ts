import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Question, QuestionFormData } from "../../../../types/question";
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
    }
})


export const { clearError } = questionSlice.actions
export default questionSlice.reducer