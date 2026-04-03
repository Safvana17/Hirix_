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
      }
    },

    CANDIDATE: {
        BASEE: '/candidate',
        LOGIN: "/candidate/login",
        REGISTER: "/candidate/register",
        GOOGLE: "/candidate/googlelogin",
        RESEND_OTP: "/candidate/resendotp",
        FORGOT_PASSWORD: '/candidate/forgotpassword',
        RESET_PASSWORD: '/candidate/resetpassword',
        VERIFY_OTP: "/candidate/verifyotp",
        VERIFY_OTP_RESET: '/candidate/verifyotpforforgotpassword'
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
        }
    }
}