import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { ROLES } from '../../constants/role'

interface PublicRouteProps {
    children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps>= ({children}) => {

    const {user, isAuthenticated, loading} = useAuth()

    console.log('from public route: ', loading, isAuthenticated, user)

    if(loading){
        return (
            <div className="flex h-screen items-center justify-center bg-[#f5f0e8]">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#6B4705]"></div>
            </div>
        );       
    }
    if(isAuthenticated && user){
        
        if(user?.role === ROLES.ADMIN){ 
            console.log('moving to admin')
            return <Navigate to={`/admin/dashboard`} replace />
        }
        if(user?.role === ROLES.CANDIDATE){
            console.log('moving to cndidat')
             return <Navigate to={`/candidate/dashboard`} replace />
        }
        if(user?.role=== ROLES.COMPANY) {
            console.log('moving to compny')
            return <Navigate to={`/company/dashboard`} replace />
        }
    }
  return (
    <>{children}</>
  )
}

export default PublicRoute
