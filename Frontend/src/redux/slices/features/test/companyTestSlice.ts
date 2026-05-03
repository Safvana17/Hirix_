import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { CancelTestArgs, CompanyTestList, CreateTestPayload, GetAllTestParams, GetAllTestResponse, Test } from "../../../../types/test"
import type { AxiosError } from "axios"
import api from "../../../../lib/axios"
import { API_ROUTES } from "../../../../constants/api.routes"

interface CompanyTestState {
    loading: boolean
    currentStep: number
    error: string | null
    tests: Test[]
    selectedTest: Test | null,
    testList: CompanyTestList[]
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
    testList: [],
    selectedTest: null,
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

export const publishTest = createAsyncThunk<
Test,
{id: string},
{rejectValue: string}
>('test/publish', async({id}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.COMPANY.TEST.PUBLISH(id))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to publish test')
    }
})

export const getAllTests = createAsyncThunk<
GetAllTestResponse,
{params: GetAllTestParams},
{rejectValue: string}
>('tests/getAll', async({params}, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.COMPANY.TEST.GET_ALL, {params})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data

    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all Tests')
    }
})

export const deleteTest = createAsyncThunk<
{id: string},
{id: string},
{rejectValue: string}
>('test/delete', async({id}, {rejectWithValue}) => {
    try {
        const response = await api.delete(API_ROUTES.COMPANY.TEST.DELETE(id))
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to delete test')
    }
})

export const cancelTest = createAsyncThunk<
void,
CancelTestArgs,
{rejectValue: string}
>('test/cancel', async(CancelTestArgs, {rejectWithValue}) => {
    try {
        const response = await api.patch(API_ROUTES.COMPANY.TEST.CANCEL(CancelTestArgs.id), {reason: CancelTestArgs.reason})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to cancel test')
    }
})
const CompanyTestSlice = createSlice({
    name: 'CompanyTestSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(createTest.pending, (state) => {
            state.loading = true
        })
        .addCase(createTest.fulfilled, (state, action) => {
            state.loading = false
            state.selectedTest = action.payload
            state.tests.unshift(action.payload)
        })
        .addCase(createTest.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to create test'
        })
        .addCase(publishTest.pending, (state) => {
            state.loading = true
        })
        .addCase(publishTest.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(publishTest.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to publish test'
        })
        .addCase(getAllTests.pending, (state) => {
            state.loading = true
        })
        .addCase(getAllTests.fulfilled, (state, action) => {
            state.loading = false
            state.testList = action.payload.tests
            state.pagination.test.totalCount = action.payload.totalCount
            state.pagination.test.totalPages = action.payload.totalPages
        })
        .addCase(getAllTests.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all tests'
        })
        .addCase(deleteTest.pending, (state) => {
            state.loading = true
        })
        .addCase(deleteTest.fulfilled, (state, action) => {
            state.loading = false
            state.testList = state.testList.filter(t => t.id != action.payload.id)
        })
        .addCase(deleteTest.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to delete test'
        })
        .addCase(cancelTest.pending, (state) => {
            state.loading = true
        })
        .addCase(cancelTest.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(cancelTest.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to delete test'
        })
    },
})

// export const { nextStep, prevStep, setStep } = CompanyTestSlice.actions
export default CompanyTestSlice.reducer