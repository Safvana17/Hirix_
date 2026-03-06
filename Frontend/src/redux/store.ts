import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/features/auth/authSlice'
import adminAuthSlice from './slices/features/auth/adminAuthSlice'


export const store = configureStore({
    reducer: {   
        auth: authSlice,
        adminAuth: adminAuthSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;