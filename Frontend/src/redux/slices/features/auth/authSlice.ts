import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserRole } from '../../../../constants/role'
import type { AuthState, LoginPayload, User, RegisterPayload, ResetPasswordPayload } from "../../../../types/user";
import api from "../../../../lib/axios";
import type { AxiosError } from "axios";




const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
    role:  null,
    isAuthenticated: false
}

// interface LoginPayload {
//     role: UserRole;
//     data: {
//         email: string;
//         password: string;
//     }
// }

export const registerUser = createAsyncThunk<
{email: string; role: UserRole},RegisterPayload,{rejectValue: string}
>('auth/register', async({role, data}, {rejectWithValue}) => {
    try {
        const response = await api.post<
        {
            success: boolean;
            message: string;
        }>(`/auth/${role}/register`, data)

        if(!response.data.success){
            return rejectWithValue('Registration failed')
        }
        return {role, email: data.email}
    } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Failed to register')
    }
})

export const loginUser = createAsyncThunk< 
{user: User; role: UserRole}, LoginPayload, {rejectValue: string}
> ('auth/login', async({role, data}, {rejectWithValue}) => {
    try {
        const response = await api.post<
                {
                    candidate?: User;
                    company?: User;
                    admin?: User
                }>(`/auth/${role}/login`, data);

        const user = response.data.candidate ||
                     response.data.company ||
                     response.data.admin
        
        if(!user){
            return rejectWithValue('Invalid login response')
        }

        return {user, role}
    } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Failed to login')
    }
})

export const googleLogin = createAsyncThunk<
{user: User, role: UserRole}, {role: UserRole,token: string}, {rejectValue: string}
>('/auth/googlelogin', async({role,token}, {rejectWithValue}) => {
    try {
        const response = await api.post<{
            candidate?: User,
            company?: User
        }>(`/auth/${role}/googlelogin`, {role, token})

        const user = response.data.candidate || response.data.company
        if(!user){
            return rejectWithValue('Invalid response')
        }

        return {user, role}
    } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Google login failed')
    }
})

export const logoutUser = createAsyncThunk <
void,
void,
{rejectValue: string}
> ('auth/logout', async(_, {rejectWithValue}) => {
    try {
        await api.post(`/auth/logout`)
    } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'logout failed')
    }
})

export const getMe = createAsyncThunk <
        {user: User},
        void,
        { rejectValue: string}
        > ('auth/getMe', async(_, {rejectWithValue}) => {

            try {
                const response = await api.get<
                {
                    user?: User;

                }>(`/auth/me`)

                console.log('from get me: ', response.data)
                const user = response.data.user

                if(!user){
                    return rejectWithValue("Invalid session response")
                }
                
                return {user}
            } catch (error) {
                const err = error as AxiosError<{ message: string }>
                return rejectWithValue(err.response?.data?.message || 'Getme failed')
            }
})


export const verifyOtp = createAsyncThunk<
{user: User, role: UserRole}, {role: UserRole, otp: string, email: string}, {rejectValue: string}
>('auth/verifyotp', async({role, otp, email}, {rejectWithValue}) => {
   try {
     const response = await api.post<
     {
        candidate?: User;
        company?: User;
        admin?: User
     }>(`/auth/${role}/verifyotp`, {email, otp})
 
     const user = response.data.candidate || response.data.company || response.data.admin
     if(!user){
        return rejectWithValue('Invalid otp response')
     }

     return {role, user}
   } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Failed to verify otp')
   }
}) 

export const resendOtp = createAsyncThunk<
{role: UserRole, email: string}, {role: UserRole,email: string},{rejectValue: string}
>('auth/resendotp', async({role, email}, {rejectWithValue}) => {
   try {
     const response = await api.post(`/auth/${role}/resendotp`, {email})
     if(!response.data.success){
        return rejectWithValue('Invalid response')
     }
    return {email, role}
   } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Failed to resend otp')
   }
})


export const forgotPassword = createAsyncThunk<
{role: UserRole, email: string},{role: UserRole, email: string}, {rejectValue: string} 
>('auth/forgotpassword', async({role, email}, {rejectWithValue}) => {
   try {
     const response = await api.post(`/auth/${role}/forgotpassword`, {email})
     if(!response.data.success){
         return rejectWithValue('Invalid response')
     }
 
     return {email, role}
   } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Failed in forgot password')
   }
})

export const resetPassword = createAsyncThunk<
void, ResetPasswordPayload, {rejectValue: string}
>('auth/resetpassword', async({role, email,otp,  newPassword, confirmPassword}, {rejectWithValue}) => {
    try {
        const response = await api.post(`/auth/${role}/resetpassword`, {email, otp, newPassword, confirmPassword})
        if(!response.data.success){
            return rejectWithValue('Invalid response')
        }
        return
    } catch (error) {
       const err = error as AxiosError<{ message: string }>
       return rejectWithValue(err.response?.data?.message || 'Failed to reset password')
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        }
    },
    extraReducers: (bulider) => {
        bulider
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.role = action.payload.role;
            state.isAuthenticated = true

            // localStorage.setItem('userRole', action.payload.role)
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Register error'
        })
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.role = action.payload.role
            state.isAuthenticated = true

            // localStorage.setItem('userRole', action.payload.role)
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Login error'
        })
        .addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.role = null

            // localStorage.removeItem("userRole")
        })

        .addCase(getMe.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getMe.fulfilled, (state, action) => {
            console.log('payload from getme: ', action.payload)
            state.loading = false;
            state.user = action.payload.user
            state.role = action.payload.user.role
            state.isAuthenticated = true
        })
        .addCase(getMe.rejected, (state, action) => {
            console.log("getMe failed:", action.error)
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(googleLogin.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(googleLogin.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
            state.role = action.payload.role
        })
        .addCase(googleLogin.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Error during google login'
        })
        .addCase(verifyOtp.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(verifyOtp.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user
            state.role = action.payload.role
            state.isAuthenticated = true
        })
        .addCase(verifyOtp.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Verify otp error'
        })
        .addCase(resendOtp.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(resendOtp.fulfilled, (state, action) =>{
            state.loading = false
            state.role = action.payload.role
        })
        .addCase(resendOtp.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Resend otp error'
        })
        .addCase(forgotPassword.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(forgotPassword.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Forgot password error'
        })
        .addCase(resetPassword.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(resetPassword.fulfilled, (state) => {
            state.loading = false
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || 'Reset password error'
        })
    }
})

export const {clearError} = authSlice.actions;
export default authSlice.reducer
