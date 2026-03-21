export const authMessages = {
    success: {
        CANDIDATE_REGISTER_SUCCESS: "Candidate registered successfully",
        COMPANY_REGISTER_PENDING: 'Registration successful! Please wait for admin approval. You will receive an email once approved.',
        COMPANY_REGISTER_SUCCESS: "Company registered successfully, ",

        CANDIDATE_LOGIN_SUCCESS: "Candidate logged in successfully",
        COMPANY_LOGIN_SUCCESS: "Company logged in successfully", // typo fixed in message (logges -> logged)

        ADMIN_LOGIN_SUCCESS: "Admin logged in successfully",

        CANDIDATE_LOGGEDOUT_SUCCESS: "Candidate logged out successfully", 
        COMPANY_LOGGEDOUT_SUCCESS: "Company logged out successfully",
        ADMIN_LOGOUT_SUCCESS: "Admin logged out successfully",

        OTP_SEND_SUCCESS: "OTP sent successfully to the email", 
        // ideally: OTP_SENT_SUCCESS
        COMPANY_EMAIL_VERIFIED: "Email verified successfully. You can now log in.",

        RESET_PASSWORD_OTP_sEND: "OTP for password reset sent successfully",
        // ideally rename constant → RESET_PASSWORD_OTP_SEND (fix casing)

        PASSWORD_RESET: "Password reset successfully",

        TOKEN_REFRESHED: "Token refreshed successfully",
        ADMIN_APPROVED_COMPANY: "Company approved",
        ADMIN_REJECTED_COMPANY: 'Company rejected and notification email sent'
    },

    error: {
        INTERNAL_SERVER_ERROR: "Internal server error",

        BAD_REQUEST: "Invalid email or password",

        CONFLICT: "Email already exists",

        UNAUTHORIZED: "Unauthorized access",

        INVALID_PASSWORD: "Invalid password", // typo fixed (passwod)

        EMAIL_NOT_FOUND: "Email not found",

        OTP_EXPIRED: "OTP has expired",

        INVALID_OTP: "Invalid OTP",

        ALREADY_VERIFIED: "User is already verified",

        ENV_VALIDATION_FAILED: "Environment validation failed",

        ACCESS_TOKEN_EXPIRED: "Access token has expired",

        REFRESH_TOKEN_NOT_FOUND: "Refresh token is missing",

        INVALID_REFRESH_TOKEN: "Invalid refresh token payload",

        REFRESH_TOKEN_SECRET_NOT_FOUND: "Refresh token secret is not available",

        ACCESS_TOKEN_SECRET_NOT_FOUND: "Access token secret is not available",

        INVALID_GOOGLE_ID: "Invalid Google ID",

        INVALID_GOOGLE_TOKEN_PAYLOAD: "Invalid Google token payload",

        GOOGLE_TOKEN_VERIFICATION_FAILURE: "Failed to verify Google token",

        INVALID_CSRF_TOKEN: "CSRF Validation failed",

        // Candidate Errors
        CANDIDATE_NOT_FOUND: "Candidate not found",

        CANDIDATE_ID_NOT_FOUND: "Candidate ID not found",

        CANDIDATE_ALREADY_EXISTS: "Candidate with this email already exists",

        CANDIDATE_BLOCKED: "Candidate is blocked by the admin",

        // Company Errors
        COMPANY_NOT_FOUND: "Company not found",

        COMPANY_ID_NOT_FOUND: "Company ID not found",

        COMPANY_ALREADY_EXISTS: "Company with this email already exists",

        COMPANY_BLOCKED: "Company is blocked by the admin",

        COMPANY_REJECTED: 'Your account registration has been rejected by the admin.',
        EMAIL_VERIFICATION_REQUIRED: 'Email verification required. A verification link has been sent to your email.',

        // Admin Errors
        ADMIN_NOT_FOUND: "Admin not found"
    }
}