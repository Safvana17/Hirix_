import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, useEffect, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getMe } from '../redux/slices/features/auth/authSlice'
import type { AppDispatch } from '../redux/store'
import PublicRoute from '../components/auth/PublicRoute'
import RoleRoute from '../components/auth/RoleRoute'
import { ROLES } from '../constants/role'

const Home = lazy(() => import( '../presentation/pages/home/Home'))
const AuthGatewayPage = lazy(() => import('../presentation/pages/auth/AuthGatewayPage'))
const VerifyOtp = lazy(() =>import('../presentation/pages/auth/VerifyOtp'))
const CompanyDashboard = lazy(() => import('../presentation/pages/company/CompanyDashboard'))
const CandidateDashboard = lazy(() => import( '../presentation/pages/candidate/CandidateDashboard'))
const ForgotPassword = lazy(() => import ( '../presentation/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../presentation/pages/auth/ResetPassword'))
const AdminLogin = lazy(() => import ( '../presentation/pages/auth/AdminLogin'))
const AdminDashboard  = lazy(() => import('../presentation/pages/admin/AdminDashboard'))
const AdminCompanies = lazy(() => import( '../presentation/pages/admin/AdminCompanies'))
const AdminCandidates = lazy(() => import( '../presentation/pages/admin/AdminCandidates'))
const AdminCompanyDetailPage = lazy(() => import('../presentation/pages/admin/AdminCompanyDetailPage'))


const App = () => {

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])


  return (
     <BrowserRouter>
       <Toaster position='top-right' />
       <Suspense fallback={
        <div className='flex h-screen items-center justify-content'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600'></div>
        </div>
       }>
        <Routes>
          <Route path='/' element={<PublicRoute><Home /></PublicRoute>} />
          <Route path='/login' element={<PublicRoute><AuthGatewayPage /></PublicRoute>}/>
          <Route path='/signup' element={<PublicRoute><AuthGatewayPage /> </PublicRoute>}/>

          <Route path='/company/verifyotp' element={<VerifyOtp />} />
          <Route path='/company/forgotpassword' element={<ForgotPassword />} />
          <Route path='/company/resetpassword' element={<ResetPassword />} />
          <Route path='/company/dashboard' element={
            <RoleRoute allowedRoles={[ROLES.COMPANY]}>
              <CompanyDashboard />
            </RoleRoute>
          } />


          <Route path='/candidate/verifyotp' element={<VerifyOtp />} />
          <Route path='/candidate/forgotpassword' element={<ForgotPassword />} />
          <Route path='/candidate/resetpassword' element={<ResetPassword /> } />
          <Route path='/candidate/dashboard' element={
            <RoleRoute allowedRoles={[ROLES.CANDIDATE]}>
              <CandidateDashboard />
            </RoleRoute>
          } />


          <Route path='/admin/login' element={<PublicRoute><AdminLogin /></PublicRoute>} />
          <Route path='/admin/dashboard' element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard /> 
            </RoleRoute>
          } />
          
          <Route path='/admin/companies' element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCompanies />
            </RoleRoute>
          } />

          <Route path='/admin/candidates' element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCandidates />
            </RoleRoute>
          } />

          <Route path='/admin/company/:id' element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCompanyDetailPage />
            </RoleRoute>
          } />
          
        </Routes>
       </Suspense>
     </BrowserRouter>
  )
}

export default App


