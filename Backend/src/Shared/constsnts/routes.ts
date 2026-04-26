export const ROUTES = {
    AUTH:{
        BASE: "/auth",
        ME: "/me",
        REFRESH: "/refresh",
        LOGOUT: "/logout",
    },

    COMPANY: {
      BASE: "/company",
      LOGIN: "/company/login",
      REGISTER: "/company/register",
      VERIFY_OTP: "/company/verifyotp",
      GOOGLE: "/company/googlelogin",
      RESEND_OTP: "/company/resendotp",
      FORGOT_PASSWORD: '/company/forgotpassword',
      RESET_PASSWORD: '/company/resetpassword',
      VERIFY_EMAIL: "/company/verifyemail",
      VERIFY_OTP_RESET: '/company/verifyotpforforgotpassword',
      SETTINGS: {
        PROFILE: '/settings/:id/profile',
        PROFILE_IMAGE: '/settings/:id/profileimage',
        PASSWORD: '/settings/:id/password',
        ACCOUNT: '/settings/:id/account',
        RESTORE_LINK: '/settings/restore-email',
        DETAILS: '/settings/deletedaccount-details',
        RESTORE: '/settings/restore'
      },
      JOBROLE: {
        BASE: '/jobroles',
        CREATE: '/jobrole',
        EDIT: '/jobrole/:id',
        STATUS: '/jobrole/:id/status',
        DELETE: '/jobrole/:id'
      },
      QUESTION: {
        BASE: '/questions',
        CREATE: '/question',
        EDIT: '/question/:id',
        DELETE: '/question/:id'
      },
      SUBSCRIPTION: {
        GET_ALL: '/plans',
        GET_CURRENT: '/plan',
        CHANGE_SUBSCRIPTION: '/change-subscription',
        MAKE_PAYMENT: '/subscription/payment',
        CONFIRM_PYMENT: '/subscription/confirm',
        MARK_FAILURE: '/subscription/failure',
        GET_BILLING_HISTORY: '/subscription/billing-history',
        CANCEL: '/subscription/:id/cancel',
        INVOICE: '/subscription/:id/invoice'
      }
    },

    CANDIDATE: {
        LOGIN: "/candidate/login",
        REGISTER: "/candidate/register",
        GOOGLE: "/candidate/googlelogin",
        RESEND_OTP: "/candidate/resendotp",
        FORGOT_PASSWORD: '/candidate/forgotpassword',
        RESET_PASSWORD: '/candidate/resetpassword',
        VERIFY_OTP: "/candidate/verifyotp",
        VERIFY_OTP_RESET: '/candidate/verifyotpforforgotpassword',
        PRACTICE: {
            GET_ALL: '/practice-questions'
        },
        SUBSCRIPTION: {
            GET_ALL: '/plans',
            GET_CURRENT: '/plan',
            CHANGE_SUBSCRIPTION: '/change-subscription',
            MAKE_PAYMENT: '/subscription/payment',
            CONFIRM_PYMENT: '/subscription/confirm',
            MARK_FAILURE: '/subscription/failure',
            GET_BILLING_HISTORY: '/subscription/billing-history',
            CANCEL: '/subscription/:id/cancel',
            INVOICE: '/subscription/:id/invoice',
            START_TRIAL: '/subscription/:id/start-trial',
        }
    },

    COMMON: {
        GET_NOTIFICATIONS: '/my-notifications',
        MARK_READ: '/mark-read'
    },

    ADMIN: {
        BASE: '/admin',
        LOGIN: "/admin/login",
        USER_MANAGEMENT: {
            COMPANIES: {
                BASE: '/companies',
                BY_ID: '/company/:id',
                STATUS: '/company/:id/status',
                APPROVE: '/company/:id/approve',
                REJECT: '/company/:id/reject'
            },
            CANDIDATES: {
                BASE: '/candidates',
                STATUS: '/candidate/:id/status'
            },
        },
        CATEGORY: {
            CREATE: '/category',
            EDIT: '/category/:id',
            DELETE: '/category/:id',
            GET_ALL: '/categories'
        },
        QUESTION: {
            CREATE: '/question',
            EDIT: '/question/:id',
            DELETE: '/question/:id',
            GET_ALL: '/questions',
            BY_ID: '/question/:id'
        },
        PRACTICE_QUESTION: {
            GET_ALL: '/practice-questions',
            BY_ID: '/practice-question/:id'
        },
        SUBSCRIPTION_PLAN: {
            CREATE: '/plan',
            EDIT: '/plan/:id',
            DELETE: '/plan/:id',
            STATUS: '/plan/:id',
            GET_ALL: '/plans'
        },
        EMAIL_TEMPLATE: {
            CREATE: '/email-template',
            EDIT: '/email-template/:id',
            STATUS: '/email-template/:id',
            DELETE: '/email-template/:id',
            BY_ID: '/email-template/:id',
            GET_aLL: '/email-templates'
        },
        NOTIFICATION_RULE: {
            CREATE: '/notification-rule',
            EDIT: '/notification-rule/:id',
            GET_ALL: '/notification-rules',
            DELETE: '/notification-rule/:id'
        }
    }
}