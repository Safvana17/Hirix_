import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import api from "../../../../lib/axios"
import type { AdminLoginPayload } from "../../../../types/admin"
import type { User } from "../../../../types/user";

interface AdminState {
    isAdminAuthenticated: boolean;
    loading: boolean;
    admin: User | null;
    error: string | null;
}

const initialState: AdminState = {
    isAdminAuthenticated: false,
    loading: false,
    admin: null,
    error: null
}

export const adminLogin = createAsyncThunk <
{admin: User}, AdminLoginPayload, {rejectValue: string}
>('admin/login', async({email, password}, {rejectWithValue}) => {
    try {
        const response = await api.post<{
            admin?: User
        }>(`/auth/admin/login`,{email, password})

        console.log('response: ', response.data)
        const admin = response.data.admin
        console.log("admin: ", admin)
        if(!admin){
            return rejectWithValue('Invalid response')
        }

        return {admin}
    } catch (error) {
        return rejectWithValue(`failed admin login: ${error}`)
    }
})


const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        clearAdminError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) =>{
        builder
        .addCase(adminLogin.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(adminLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.isAdminAuthenticated = true
            state.admin= action.payload.admin
        })
        .addCase(adminLogin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Admin login error'
        })
    }
})

export const { clearAdminError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;