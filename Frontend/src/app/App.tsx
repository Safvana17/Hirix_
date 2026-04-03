import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Suspense, useEffect, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getMe } from '../redux/slices/features/auth/authSlice'
import type { AppDispatch } from '../redux/store'
import PublicRoute from '../components/auth/PublicRoute'
import RoleRoute from '../components/auth/RoleRoute'
import { ROLES } from '../constants/role'
import { ROUTES } from '../constants/routes'
import ChangePassword from '../presentation/components/company/ChangePassword'
import RestoreAccount from '../presentation/pages/company/RestoreAccount'
import JobRoles from '../presentation/pages/company/JobRoles'
import AdminCategory from '../presentation/pages/admin/AdminCategory'
import AdminTestQuestions from '../presentation/pages/admin/AdminTestQuestions'



const Home = lazy(() => import( '../presentation/pages/home/Home'))
const AuthGatewayPage = lazy(() => import('../presentation/pages/auth/AuthGatewayPage'))
const VerifyOtp = lazy(() =>import('../presentation/pages/auth/VerifyOtp'))
const VerifyCompanyEmail = lazy(() => import('../presentation/pages/auth/VerifyEmail'))
const CompanyDashboard = lazy(() => import('../presentation/pages/company/CompanyDashboard'))
const CandidateDashboard = lazy(() => import( '../presentation/pages/candidate/CandidateDashboard'))
const ForgotPassword = lazy(() => import ( '../presentation/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('../presentation/pages/auth/ResetPassword'))
const AdminLogin = lazy(() => import ( '../presentation/pages/auth/AdminLogin'))
const AdminDashboard  = lazy(() => import('../presentation/pages/admin/AdminDashboard'))
const AdminCompanies = lazy(() => import( '../presentation/pages/admin/AdminCompanies'))
const AdminCandidates = lazy(() => import( '../presentation/pages/admin/AdminCandidates'))
const AdminCompanyDetailPage = lazy(() => import('../presentation/pages/admin/AdminCompanyDetailPage'))
const CompanySettings = lazy(() => import('../presentation/pages/company/CompanySettings'))


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
          <Route path={ROUTES.PUBLIC.HOME} element={<PublicRoute><Home /></PublicRoute>} />
          <Route path={ROUTES.PUBLIC.LOGIN} element={<PublicRoute><AuthGatewayPage /></PublicRoute>}/>
          <Route path={ROUTES.PUBLIC.SIGNUP} element={<PublicRoute><AuthGatewayPage /> </PublicRoute>}/>

          <Route path={ROUTES.COMPANY.VERIFY_EMAIL} element={<VerifyCompanyEmail />} />
          <Route path={ROUTES.COMPANY.RESTORE} element={<RestoreAccount />} />
          <Route path={ROUTES.COMPANY.VERIFY_OTP} element={<VerifyOtp />} />
          <Route path={ROUTES.COMPANY.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.COMPANY.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.COMPANY.DASHBOARD} element={
            <RoleRoute allowedRoles={[ROLES.COMPANY]}>
              <CompanyDashboard />
            </RoleRoute>
          } />
          <Route path={ROUTES.COMPANY.SETTINGS} element={
             <RoleRoute allowedRoles={[ROLES.COMPANY]}>
              <CompanySettings />
             </RoleRoute>
          } />
          <Route path={ROUTES.COMPANY.PASSWORD} element={
            <RoleRoute allowedRoles={[ROLES.COMPANY]}>
              <ChangePassword />
            </RoleRoute>
          } />

         <Route path={ROUTES.COMPANY.RESTORE} element={<RestoreAccount />} />
         
          <Route path={ROUTES.COMPANY.JOB_ROLES} element={
            <RoleRoute allowedRoles={[ROLES.COMPANY]}>
              <JobRoles />
            </RoleRoute>
          } />


          <Route path={ROUTES.CANDIDATE.VERIFY_OTP} element={<VerifyOtp />} />
          <Route path={ROUTES.CANDIDATE.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.CANDIDATE.RESET_PASSWORD} element={<ResetPassword /> } />
          <Route path={ROUTES.CANDIDATE.DASHBOARD} element={
            <RoleRoute allowedRoles={[ROLES.CANDIDATE]}>
              <CandidateDashboard />
            </RoleRoute>
          } />


          <Route path={ROUTES.ADMIN.LOGIN} element={<PublicRoute><AdminLogin /></PublicRoute>} />
          <Route path={ROUTES.ADMIN.DASHBOARD} element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard /> 
            </RoleRoute>
          } />
          
          <Route path={ROUTES.ADMIN.COMPANIES} element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCompanies />
            </RoleRoute>
          } />

          <Route path={ROUTES.ADMIN.CANDIDATES} element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCandidates />
            </RoleRoute>
          } />

          <Route path={ROUTES.ADMIN.COMPANY_DETAIL} element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCompanyDetailPage />
            </RoleRoute>
          } />

          <Route path={ROUTES.ADMIN.CATEGORIES} element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminCategory />
            </RoleRoute>
          } />

          <Route path={ROUTES.ADMIN.QUESTIONS} element={
            <RoleRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminTestQuestions />
            </RoleRoute>
          } />
          
        </Routes>
       </Suspense>
     </BrowserRouter>
  )
}

export default App


