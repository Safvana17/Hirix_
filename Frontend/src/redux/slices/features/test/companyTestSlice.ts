import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { CreateTestPayload, Test } from "../../../../types/test"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"

interface CompanyTestState {
    loading: boolean
    currentStep: number
    error: string | null
    tests: Test[]
    pagination: {
        test: {
            totalCount: number
            totalPages: number
        }
    }
}

const initialState: CompanyTestState = {
    loading: false,
    currentStep: 0,
    error: null,
    tests: [],
    pagination: {
        test: {
            totalCount: 0,
            totalPages: 0
        }
    }
}

export const createTest = createAsyncThunk<
Test,
CreateTestPayload,
{rejectValue: string}
>('test/create', async(createTestPayload, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.COMPANY.TEST.CREATE, createTestPayload)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to create test')
    }
})

const CompanyTestSlice = createSlice({
    name: 'CompanyTestSlice',
    initialState,
    reducers: {
        nextStep: (state) => {
            state.currentStep += 1
        },
        prevStep: (state) => {
            state.currentStep -= 1
        },
        setStep: (state, action) => {
            state.currentStep = action.payload
        },
        resetTestCreation: () => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(createTest.pending, (state) => {
            state.loading = true
        })
        .addCase(createTest.fulfilled, (state, action) => {
            state.loading = false
            state.tests.unshift(action.payload)
        })
        .addCase(createTest.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to create test'
        })
    },
})

export const { nextStep, prevStep, setStep } = CompanyTestSlice.actions
export default CompanyTestSlice.reducer