import type { UserRole } from "./role";

export const API_ROUTES = {
  AUTH: {
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",

    LOGIN: (role: string) => `/auth/${role}/login`,
    REGISTER: (role: string) => `/auth/${role}/register`,
    VERIFY_OTP: (role: string) => `/auth/${role}/verifyotp`,
    RESEND_OTP: (role: string) => `/auth/${role}/resendotp`,
    FORGOT_PASSWORD: (role: string) => `/auth/${role}/forgotpassword`,
    VERIFY_OTP_RESET: (role: string) => `/auth/${role}/verifyotpforforgotpassword`,
    RESET_PASSWORD: (role: string) => `/auth/${role}/resetpassword`,
    GOOGLE_LOGIN: (role: string) => `/auth/${role}/googlelogin`,
  },

  COMPANY: {
    VERIFY_EMAIL: (token: string) =>
      `/auth/company/verifyemail?token=${token}`,
    PROFILE: (id: string) => 
      `/company/settings/${id}/profile`,
    PROFILE_LOGO: (id: string) => 
      `/company/settings/${id}/profileimage`,
    PASSWORD: (id: string) => 
      `/company/settings/${id}/password`,
    ACCOUNT: (id: string) => 
      `/company/settings/${id}/account`,
    RESTORE: (token: string) => 
      `/company/settings/restore?token=${token}`,
    DETAILS: (token: string) => 
      `/company/settings/deletedaccount-details?token=${token}`,
    RESTORE_EMAIL: '/company/settings/restore-email',
    JOB_ROLE: '/company/jobrole',
    GET_ALL_JOBROLE: '/company/jobroles',
    EDIT_JOBROLE: (id: string) => 
      `/company/jobrole/${id}`,
    JOBROLE_STATUS: (id: string) => 
      `/company/jobrole/${id}/status`,
    DELETE_JOB_ROLE: (id: string) => 
      `/company/jobrole/${id}`,
    // SUBSCRIPTION: {
    //   GET_ALL: `/company/plans`,
    //   GET_CURRENT: `/company/plan`,
    //   CHANGE_SUBSCRIPTION: `/company/change-subscription`,
    //   MAKE_PAYMENT: '/company/subscription/payment',
    //   CONFIRM_PAYMENT: '/company/subscription/confirm',
    //   MARK_FAILURE: '/company/subscription/failure',
    //   GET_BILLING_HISTORY: '/company/subscription/billing-history',
    //   CANCEL: (id: string) =>
    //     `/company/subscription/${id}/cancel`,
    //   INVOICE: (id: string) => 
    //     `company/subscription/${id}/invoice`,
    // }
  },

  ADMIN: {
    LOGIN: "/auth/admin/login",
    COMPANIES: {
      GET_ALL: "/admin/companies",
      BY_ID: (id: string) => `/admin/company/${id}`,
      APPROVE: (id: string) => `/admin/company/${id}/approve`,
      REJECT: (id: string) => `/admin/company/${id}/reject`,
      STATUS: (id: string) => `/admin/company/${id}/status`,
    },

    CANDIDATES: {
      GET_ALL: "/admin/candidates",
      STATUS: (id: string) => `/admin/candidate/${id}/status`,
    },
    CATEGORY: {
      CREATE: '/admin/category',
      EDIT: (id: string) => 
        `/admin/category/${id}`,
      DELETE: (id: string) => 
        `/admin/category/${id}`,
      GET_ALL: '/admin/categories'
    },
    TEST_QUESTIONS: {
      CREATE: '/admin/question',
      EDIT: (id: string) => 
        `/admin/question/${id}`,
      DELETE: (id: string) => 
        `/admin/question/${id}`,
      BY_ID: (id: string) => 
        `/admin/question/${id}`,
      GET_ALL: '/admin/questions'
    },
    PRACTICE_QUESTION: {
      GET_ALL: (role: UserRole) =>
        `/${role}/practice-questions`,
    },
    SUBSCRIPTION_PLAN: {
      CREATE: '/admin/plan',
      EDIT: (id: string) =>
         `/admin/plan/${id}`,
      DELETE: (id: string) => 
        `/admin/plan/${id}`,
      STATUS: (id: string) => 
        `/admin/plan/${id}`,
      GET_ALL: '/admin/plans'
    },
    EMAIL_TEMPLATE: {
      CREATE: '/admin/email-template',
      EDIT: (id: string) => 
        `/admin/email-template/${id}`,
      DELETE: (id: string) => 
        `/admin/email-template/${id}`,
      BY_ID: (id: string) => 
        `/admin/email-template/${id}`,
      GET_ALL: '/admin/email-templates',
    },
    NOTIFICATION_RULE: {
      CREATE: '/admin/notification-rule',
      EDIT: (id: string) =>
        `/admin/notification-rule/${id}`,
      GET_ALL: '/admin/notification-rules',
    }
  },
  COMMON: {
    QUESTION: {
      CREATE: (role: UserRole) => 
        `/${role}/question`,
      EDIT: (role: UserRole, id: string) => 
        `/${role}/question/${id}`,
      DELETE: (id: string, role: UserRole) => 
        `/${role}/question/${id}`,
      GET_ALL: (role: UserRole) => 
        `/${role}/questions`
    },
    SUBSCRIPTION: {
      GET_ALL: (role: UserRole) => 
        `/${role}/plans`,
      GET_CURRENT: (role: UserRole) =>
         `/${role}/plan`,
      CHANGE_SUBSCRIPTION: (role: UserRole) =>
         `/${role}/change-subscription`,
      MAKE_PAYMENT:(role: UserRole) =>
         `/${role}/subscription/payment`,
      CONFIRM_PAYMENT: (role: UserRole) =>
         `/${role}/subscription/confirm`,
      MARK_FAILURE: (role: UserRole) =>
        `/${role}/subscription/failure`,
      GET_BILLING_HISTORY: (role: UserRole) =>
        `/${role}/subscription/billing-history`,
      CANCEL: (id: string, role: UserRole) =>
        `/${role}/subscription/${id}/cancel`,
      INVOICE: (id: string, role: UserRole) => 
        `/${role}/subscription/${id}/invoice`,
    }
  }
}