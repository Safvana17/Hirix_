import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { CandidateTest, CodeRunnerArgs, CodeRunnerResponse, TestCandidate, TestCandidateAnswer, TestCandidateResponse } from "../../../../types/test"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"

interface CandidateTestState {
    loading: boolean
    codeRunning: boolean
    error: string | null
    test: CandidateTest | null
    candidate: TestCandidate | null
}

const initialState: CandidateTestState = {
    loading: false,
    codeRunning: false,
    error: null,
    test: null,
    candidate: null
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
        console.log('from slice: ', response.data.data)
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
    }
})

export default candidateTestSlice.reducer