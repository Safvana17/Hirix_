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
    RESET_PASSWORD: (role: string) => `/auth/${role}/resetpassword`,
    GOOGLE_LOGIN: (role: string) => `/auth/${role}/googlelogin`,
  },

  COMPANY: {
    VERIFY_EMAIL: (token: string) =>
      `/auth/company/verifyemail?token=${token}`,
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
    }
  },
}