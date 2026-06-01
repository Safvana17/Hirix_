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

  CANDIDATE: {
    TEST: {
      GET_TEST: (token: string) => 
        `/candidate/test/${token}` ,
      TEST_LOGIN: (token: string) =>
        `/candidate/test/${token}/login`, 
      START: (token: string) =>
        `/candidate/test/${token}/start`,
      RUN_CODE: (token: string) => 
        `/candidate/test/${token}/run`,
      SUBMIT: (token: string) => 
        `/candidate/test/${token}/submit`,
      TERMINATE: (token: string) => 
        `/candidate/test/${token}/terminate`,
      SUBMIT_QUESTION: (token: string) =>
        `/candidate/test/${token}/question`,
      GET_CATEGORIES: (token: string) =>
        `/candidate/test/${token}/categories`,
      SAVE_ANSWER: (token: string) => 
        `/candidate/test/${token}/save`
    },
    PRACTICE: {
      GET_BY_ID: (questionId: string) => 
        `/candidate/practice-question/${questionId}`,
      GET_RELATED: (questionId: string) => 
        `/candidate/practice-question/${questionId}/related`,
      SUBMIT: (questionId: string) =>
        `/candidate/practice-question/${questionId}/submit`,
      GET_EXPLANATION: (questionId: string) => 
        `/candidate/practice-question/${questionId}/explanation`,
    } 
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
    TEST: {
      CREATE: '/company/test',
      PUBLISH: (id: string) =>
        `/company/test/${id}`,
      EDIT: (id: string) => 
        `/company/test/${id}/edit`,
      DELETE: (id: string) => 
        `/company/test/${id}`,
      CANCEL: (id: string) => 
        `/company/test/${id}/cancel`,
      RESCHEDULE: (id: string) => 
        `/company/test/${id}/reshedule`,
      GET_ALL: '/company/tests',
      GET_BY_ID: (id: string) => 
        `/company/test/${id}`,
      GET_QUESTIONS: '/company/test/questions',
      EVALUATE: (id: string) => 
        `/company/test/${id}/evaluate`,
      SHORTLIST: (id: string) => 
        `/company/test/${id}/shortlist`,
      REJECT: (id: string) => 
        `/company/test/${id}/reject`,
      SCHEDULE_AGAIN: (id: string) => 
        `/company/test/${id}/schedule-again`
    },
    INTERVIEW :{
      SCHEDULE: '/company/interview/schedule',
      RESCHEDULE: (interviewId: string) =>
         `/company/interview/${interviewId}/reschedule`,
      CANCEL: (interviewId: string) => 
        `/company/interview/${interviewId}/cancel`,
      GET_ALL: '/company/interviews',
      GET_BY_ID: (interviewId: string) => 
        `/company/interview/${interviewId}`,
      EDIT: (interviewId: string) => 
        `/company/interview/${interviewId}`,
      UPDATE_RESULT: (interviewId: string) =>
        `/company/interview/${interviewId}/result`,
      SEND_OFFER_LETTER: (interviewId: string) => 
        `/company/interview/${interviewId}/offer`
    }
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
      DELETE: (id: string) =>
        `/admin/notification-rule/${id}`,
    },
    ANALYTICS: {
      REVENUE_SUMMERY: '/admin/revenue-summery',
      REVENUE_TREND_BY_MONTH: '/admin/revenue-month',
      REVENUE_TREND_BY_PLAN: '/admin/revenue-plan',
      PAYMENT_HISTORY: '/admin/payment-history',
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
      START_TRIAL: (id: string, role: UserRole) =>
        `/${role}/subscription/${id}/start-trial`
    },
    NOTIFICATION : {
      GET_NOTIFICATIONS: (role: UserRole) => 
      `/${role}/my-notifications`,
    MARK_READ: (role: UserRole) => 
      `/${role}/mark-read`
    },
    INTERVIEW: {
      GET_ACCESS:(roomId: string, token: string) =>
        `/interview/${roomId}/${token}/access`,
      JOIN: (roomId: string, token: string) => 
        `/interview/${roomId}/${token}/join`,
      END: (roomId: string, token: string) => 
        `/interview/${roomId}/${token}/end`,
      
    }
  }
}