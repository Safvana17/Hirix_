import React from 'react'
import type { UserRole } from '../../constants/role';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface RoleRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[]
}
const RoleRoute: React.FC<RoleRouteProps>= ({children, allowedRoles}) => {
  
    const {user, isAuthenticated, loading } = useAuth()

    console.log('from role route: ', loading, isAuthenticated, user)
 
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
            </div>
        );
    }
    if(!isAuthenticated){
        return <Navigate to='/login' replace />
    }

    if(!user || !allowedRoles.includes(user.role)){
        console.log('user from role route: ', user)
        console.log('moving to home page')
        return <Navigate to='/' replace />
    }
    return (
      <>{children}</>
  )
}

export default RoleRoute
