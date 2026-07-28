import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { CandidateTest, CodeRunnerArgs, CodeRunnerResponse, TestCandidate, TestCandidateAnswer, TestCandidateResponse, UploadSnpshotResponse } from "../../../../types/test"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"
import type { QuestionFormData } from "../../../../types/question"
import type { Category } from "../../../../types/category"

interface CandidateTestState {
    loading: boolean
    codeRunning: boolean
    warningCount: number
    error: string | null
    test: CandidateTest | null
    candidate: TestCandidate | null
    categories: Category[]
}

const initialState: CandidateTestState = {
    loading: false,
    codeRunning: false,
    error: null,
    warningCount: 0,
    test: null,
    candidate: null,
    categories: []
}

export const getTestByToken = createAsyncThunk<
TestCandidateResponse,
{token: string},
{rejectValue: string}
>('candidate/getTest', async({token}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.CANDIDATE.TEST.GET_TEST(token))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get test')
    }
})

export const testCandidateLogin = createAsyncThunk<
TestCandidateResponse,
{data: {name: string, email: string}, token: string},
{rejectValue: string}
>('candidate/testLogin', async({data, token}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.CANDIDATE.TEST.TEST_LOGIN(token), data)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to login')
    }
})

export const startTest = createAsyncThunk<
TestCandidateResponse,
{token: string},
{rejectValue: string}
>('candidate/startTest', async({token}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.CANDIDATE.TEST.START(token))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to start test')
    }
})

export const testRunCode = createAsyncThunk<
CodeRunnerResponse,
{data: CodeRunnerArgs, token: string},
{rejectValue: string}
>('candidate/runCode', async({data, token}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.CANDIDATE.TEST.RUN_CODE(token), data)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to run code')
    }
})

export const submitTest = createAsyncThunk<
void,
{token: string, answer: TestCandidateAnswer[], warningCount: number},
{rejectValue: string}
>('candidate/submitTest', async({token, answer, warningCount}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.CANDIDATE.TEST.SUBMIT(token), {answer, warningCount})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to submit test')
    }
})

export const terninateTest = createAsyncThunk<
void,
{token: string, answer: TestCandidateAnswer[], warningCount: number},
{rejectValue: string}
>('candidate/terminateTest', async({token, answer, warningCount}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.CANDIDATE.TEST.TERMINATE(token), {answer, warningCount})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to terminate')
    }
})

export const submitQuestion = createAsyncThunk<
void,
{token: string, data: QuestionFormData},
{rejectValue: string}
>('candidate/submitQuestion', async({token, data}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.CANDIDATE.TEST.SUBMIT_QUESTION(token), data)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to submit question')
    }
})

export const getAllPublicCategories = createAsyncThunk<
Category[],
{token: string},
{rejectValue: string}
>('candidate/getAllCategories', async({token},{rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.CANDIDATE.TEST.GET_CATEGORIES(token))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all categories')
    }
})

export const saveAnswer = createAsyncThunk<
void,
{token: string, answer: TestCandidateAnswer[]},
{rejectValue: string}
>('candidate/saveAnswer', async({token, answer}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.CANDIDATE.TEST.SAVE_ANSWER(token), {answer})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to save answer')
    }
})

export const updateWarningCount = createAsyncThunk<
number,
{token: string},
{rejectValue: string}
>('candidate/warning', async({token}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.CANDIDATE.TEST.WARNING_COUNT(token))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to update warning count')
    }
})

export const generateSnapshotUrl = createAsyncThunk<
UploadSnpshotResponse,
{token: string},
{rejectValue: string}
>('candidate/generateUrl', async({token}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.CANDIDATE.TEST.GET_UPLOAD_URL(token), {
            fileName: `snapshot-${Date.now()}.jpg`,
            contentType: "image/jpeg"
        })

        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to generate url')
    }
})

export const saveCandidateSnapshot = createAsyncThunk<
void,
{token: string, key: string},
{rejectValue: string}
>('candidate/snapshot', async({token, key}, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.CANDIDATE.TEST.SAVE_SNAPSHOT(token), {key})

        if(!response.data.success){
            return rejectWithValue('Invalid response')
        
        }
        
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to upload snapshot')
    }
})

const candidateTestSlice = createSlice({
    name: 'CandidateTestSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getTestByToken.pending, (state) => {
            state.loading = true
        })
        .addCase(getTestByToken.fulfilled, (state, action) => {
            state.loading = false
            state.test = action.payload.test
            state.candidate = action.payload.candidate
        })
        .addCase(getTestByToken.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'failed to get test'
        })
        .addCase(testCandidateLogin.pending, (state) => {
            state.loading = true
        })
        .addCase(testCandidateLogin.fulfilled, (state, action) => {
            state.loading = false
            state.candidate = action.payload.candidate
            state.test = action.payload.test
        })
        .addCase(testCandidateLogin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to login'
        })
        .addCase(startTest.pending, (state) => {
            state.loading = true
        })
        .addCase(startTest.fulfilled, (state, action) => {
            state.loading = false
            state.candidate = action.payload.candidate
            state.test = action.payload.test
        })
        .addCase(startTest.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to login'
        })
        .addCase(testRunCode.pending, (state) => {
            state.codeRunning = true
        })
        .addCase(testRunCode.fulfilled, (state) => {
            state.codeRunning = false
        })
        .addCase(testRunCode.rejected, (state, action) => {
            state.codeRunning = false
            state.error = action.payload || 'Failed to login'
        })
        .addCase(submitTest.pending, (state) => {
            state.loading = true
        })
        .addCase(submitTest.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(submitTest.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to submit test'
        })
        .addCase(terninateTest.pending, (state) => {
            state.loading = true
        })
        .addCase(terninateTest.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(terninateTest.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to terminate'
        })
        .addCase(submitQuestion.pending, (state) => {
            state.loading = true
        })
        .addCase(submitQuestion.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(submitQuestion.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to submit question'
        })
        .addCase(getAllPublicCategories.pending, (state) => {
            state.loading = true
        })
        .addCase(getAllPublicCategories.fulfilled, (state, action) => {
            state.loading = false
            state.categories = action.payload
        })
        .addCase(getAllPublicCategories.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get categories'
        })
        .addCase(saveAnswer.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to submit test'
        })
        .addCase(updateWarningCount.fulfilled, (state, action) => {
            state.loading = false
            state.warningCount = action.payload
        })
        .addCase(updateWarningCount.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to update warning count'
        })
        .addCase(generateSnapshotUrl.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to generate url'
        })
        .addCase(saveCandidateSnapshot.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to upload snapshot'
        })
    }
})

export default candidateTestSlice.reducer