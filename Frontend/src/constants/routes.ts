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
    SETTINGS:'/company/settings',
    PASSWORD: '/company/password',
    RESTORE: '/company/restore-account',
    JOB_ROLES: '/company/job-roles',
    QUESTIONS: '/company/questions',
    SUBSCRIPTION: '/company/subscriptions',
  },

  CANDIDATE: {
    VERIFY_OTP: '/candidate/verifyotp',
    FORGOT_PASSWORD: '/candidate/forgotpassword',
    RESET_PASSWORD: '/candidate/resetpassword',
    DASHBOARD: '/candidate/dashboard',
    SUBSCRIPTION: '/candidate/subscription',
  },

  COMMON: {
    PAYMENT_STATUS: '/payment-status',
    PAYMENT: '/payment'
  },

  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    COMPANIES: '/admin/companies',
    CANDIDATES: '/admin/candidates',
    COMPANY_DETAIL: `/admin/company/:id`,
    COMPANY_DETAIL_PATH: (id: string) => `/admin/company/${id}`,
    CATEGORIES: '/admin/categories',
    QUESTIONS: '/admin/questions',
    PRACTICE_LIBRARY: '/admin/practicelibrary',
    SUBSCRIPTIONS: '/admin/subscriptions',
    SETTINGS: '/admin/settings',
  },
}