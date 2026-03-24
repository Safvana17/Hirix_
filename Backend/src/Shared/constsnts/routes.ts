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
      VERIFY_OTP_RESET: '/company/verifyotpforforgotpassword'
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
            }
        }
    }
}