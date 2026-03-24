export interface VerifyCompanyOtpForForgotPasswordInputDTO {
    email: string 
    otp: string
}

export interface VerifyCompanyOtpForForgotPasswordOutputDTO{
    email: string
    resetToken: string
}