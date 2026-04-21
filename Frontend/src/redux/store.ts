import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/features/auth/authSlice'
import userSlice from './slices/features/users/usersSlice'
import CompanySettingsSlice from './slices/features/settingsSlice/companySettingsSlice'
import JobRoleSlice from './slices/features/jobRoles/jobRoleSlice'
import CategorySlice from './slices/features/category/categorySlice'
import questionSlice from './slices/features/question/questionSlice'
import PracticeQuestionSlice from './slices/features/question/practiceQuestionSlice'
import SubscriptionPlanSlice from './slices/features/subscription/subscriptionPlanSlice'
import SubscriptionSlice from './slices/features/subscription/subscriptionSlice'
import AdminSettingsSlice from './slices/features/settingsSlice/adminSettings'



export const store = configureStore({
    reducer: {   
        auth: authSlice,
        userSlice: userSlice,
        companySettings: CompanySettingsSlice,
        jobRole: JobRoleSlice,
        category: CategorySlice,
        question: questionSlice,
        practiceQuestion: PracticeQuestionSlice,
        subscriptionPlan: SubscriptionPlanSlice,
        subscription: SubscriptionSlice,
        AdminSettings: AdminSettingsSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;