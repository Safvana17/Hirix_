import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/features/auth/authSlice'
import userSlice from './slices/features/users/usersSlice'

export const store = configureStore({
    reducer: {   
        auth: authSlice,
        userSlice: userSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;