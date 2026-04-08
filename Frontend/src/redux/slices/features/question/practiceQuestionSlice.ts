import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { getAllQuestionsParams, getAllQuestionsResponse, Question } from "../../../../types/question";
import type { UserRole } from "../../../../constants/role";
import type { AxiosError } from "axios";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";

interface PracticeQuestionState {
    PracticeQuestions: Question[];
    error: string | null;
    loading: boolean;
    selectedPracticeQuestion: Question | null;
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
    }
})

export const { reset } = PraticeQuestionSlice.actions
export default PraticeQuestionSlice.reducer