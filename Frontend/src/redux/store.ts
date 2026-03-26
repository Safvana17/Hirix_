import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/features/auth/authSlice'
import userSlice from './slices/features/users/usersSlice'
import CompanySettingsSlice from './slices/features/settingsSlice.ts/companySettingsSlice'

export const store = configureStore({
    reducer: {   
        auth: authSlice,
        userSlice: userSlice,
        companySettings: CompanySettingsSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;