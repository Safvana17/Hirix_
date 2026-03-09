import { useDispatch, useSelector } from "react-redux"
import {type AppDispatch, type RootState } from "../redux/store"
import { clearError, getMe, loginUser, logoutUser, registerUser } from "../redux/slices/features/auth/authSlice"
import type { UserRole } from "../constants/role"
import type { LoginData, RegisterData } from "../types/user"

export const useAuth = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)
    // const { admin, isAdminAuthenticated } = useSelector((state: RootState) => state.adminAuth)

    const handleError = () => dispatch(clearError())

    const register = async (role: UserRole, data: RegisterData) => {
        return dispatch(registerUser({role, data})).unwrap()
    }

    const login = async (role: UserRole, data: LoginData) => {
        return dispatch(loginUser({role, data})).unwrap()
    }

    const logout = async() => {
        return dispatch(logoutUser()).unwrap()
    }

    const checkAuth = async () => {
        return dispatch(getMe()).unwrap()
    }

    return {
        user,
        isAuthenticated,
        loading,
        error,
        clearError: handleError,
        register,
        login,
        logout,
        checkAuth,
        isAdmin: user?.role === 'Admin',
        isCandidate: user?.role === 'Candidate',
        isCompany: user?.role === 'Company'
    }
}