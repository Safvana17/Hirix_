import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/features/auth/authSlice'
import adminAuthSlice from './slices/features/auth/adminAuthSlice'
import userSlice from './slices/features/users/usersSlice'

export const store = configureStore({
    reducer: {   
        auth: authSlice,
        adminAuth: adminAuthSlice,
        userSlice: userSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;