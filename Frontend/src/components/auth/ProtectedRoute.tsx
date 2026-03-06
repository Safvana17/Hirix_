import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {

    const {isAuthenticated, loading} = useAuth()
    const location = useLocation()

    if(loading){
        return(
            <div className='flex h-screen items-center justify-center'>
                  <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600'></div>
            </div>
        )
    }
    if(!isAuthenticated){
        return <Navigate to="/login" state={{from: location}} replace />
    }
  return (
    <>
     {children}
    </>
  )
}

export default ProtectedRoute
