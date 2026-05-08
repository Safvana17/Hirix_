import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { CandidateTest, TestCandidate, TestCandidateResponse } from "../../../../types/test"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"

interface CandidateTestState {
    loading: boolean
    error: string | null
    test: CandidateTest | null
    candidate: TestCandidate | null
}

const initialState: CandidateTestState = {
    loading: false,
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
    }
})

export default candidateTestSlice.reducer