export interface verifyCandidateForgotPasswordOtpInputDTO {
    email: string
    otp: string
}

export interface verifyCandidateForgotPasswordOtpOutputDTO {
    email: string
    resetToken: string
}