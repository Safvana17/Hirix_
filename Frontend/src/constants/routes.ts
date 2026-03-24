export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
  },

  COMPANY: {
    VERIFY_EMAIL: '/company/verifyemail',
    VERIFY_OTP: '/company/verifyotp',
    FORGOT_PASSWORD: '/company/forgotpassword',
    RESET_PASSWORD: '/company/resetpassword',
    DASHBOARD: '/company/dashboard',
  },

  CANDIDATE: {
    VERIFY_OTP: '/candidate/verifyotp',
    FORGOT_PASSWORD: '/candidate/forgotpassword',
    RESET_PASSWORD: '/candidate/resetpassword',
    DASHBOARD: '/candidate/dashboard',
  },

  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    COMPANIES: '/admin/companies',
    CANDIDATES: '/admin/candidates',
    COMPANY_DETAIL: `/admin/company/:id`,
    COMPANY_DETAIL_PATH: (id: string) => `/admin/company/${id}`
  },
}