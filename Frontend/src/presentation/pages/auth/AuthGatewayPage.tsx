import React, { useState } from 'react'
import  { type UserRole } from '../../../constants/role'
import { useLocation } from 'react-router-dom'
import AuthLayout from '../../layouts/AuthLayout'
import RoleSelection from '../../components/auth/RoleSelection'
import AuthForm from '../../components/auth/AuthForm'



type publicAuthRole = Exclude<UserRole, 'admin'>

const AuthGatewayPage: React.FC = () => {

    const [role, setRole] = useState<publicAuthRole | null> (null)
    const location = useLocation()
    // const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
    // const [emailForRestore, setEmailForRestore] = useState('')

    const mode: 'login' | 'signup' = location.pathname.includes('login') ? 'login' : 'signup'

    // useEffect(() => {
    //     setRole(null)
    // }, [location.pathname])

    const resolveAuthContent = () => {
        if(mode === 'login'){
            return {
                title: 'Welcome, Nice to see you again.',
                subTitle: (role) ? `sign in to your ${role} account` : "Select your account type to continue."
            }
        }
        return {
            title: '',
            subTitle: role ? `Resgister as a ${role}` : 'Choose how you want to join our platform'
        }
    }

    const {title, subTitle} = resolveAuthContent()
  return (
    <AuthLayout title={title} subtitle={subTitle}>
       {!role ? (
           <RoleSelection onSelect={(selectedRole) => setRole(selectedRole)}/>
       ): (
           <AuthForm 
           mode={mode} 
           role={role} 
           onBack={() => setRole(null)}   
           />
       )}
    </AuthLayout>
  )
}

export default AuthGatewayPage
