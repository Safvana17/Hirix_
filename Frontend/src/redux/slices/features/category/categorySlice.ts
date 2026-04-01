import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Category, createCategoryPayload, GetAllCategoryResponse } from "../../../../types/category";
import api from "../../../../lib/axios";
import { API_ROUTES } from "../../../../constants/api.routes";
import type { AxiosError } from "axios";

interface CategoryState {
    loading: boolean;
    error: string | null;
    categories: Category[]
    selectedCategory: Category | null;
    pagination: {
        category: {
            totalPages: number;
            totalCount: number
        }
    }
}

const initialState: CategoryState = {
    loading : true,
    error: null,
    categories: [],
    selectedCategory: null,
    pagination: {
        category: {
            totalCount: 0,
            totalPages: 0
        }
    }
}

export const createCategory = createAsyncThunk<
Category,
createCategoryPayload,
{rejectValue: string}
>('category/create', async({name, parentId}, {rejectWithValue}) => {
    try {
        const response = await api.post(API_ROUTES.ADMIN.CATEGORY.CREATE, {name, parentId})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }

        return response.data.category
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to create category')
    }
})

export const getAllCategories = createAsyncThunk<
GetAllCategoryResponse,
void,
{rejectValue: string}
>('category/getAll', async(_, {rejectWithValue}) => {
    try {
        const response = await api.get(API_ROUTES.ADMIN.CATEGORY.GET_ALL)
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return response.data
    } catch (error) {
        const err = error as AxiosError<{message: string}>
        return rejectWithValue(err.response?.data.message || 'Failed to get all categories')
    }
})

const categorySlice = createSlice({
    name: 'Category',
    initialState,
    reducers: {
        clearCategoryError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(createCategory.pending, (state) => {
            state.loading = true
          })
          .addCase(createCategory.fulfilled, (state, action) => {
            state.loading = false
            state.categories.unshift(action.payload)
          })
          .addCase(createCategory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to create category'
          })
          .addCase(getAllCategories.pending, (state) => {
            state.loading = true
          })
          .addCase(getAllCategories.fulfilled, (state, action) => {
            state.loading = false
            state.categories = action.payload.categories.filter(c => !c.isDeleted)
          })
          .addCase(getAllCategories.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Failed to get all categories'
          })
    }
})

export const { clearCategoryError } = categorySlice.actions
export default categorySlice.reducer