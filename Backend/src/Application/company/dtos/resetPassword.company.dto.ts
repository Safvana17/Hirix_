export interface CompanyResetPasswordInputDTO {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

export interface CompanyResetPasswordOutputDTO {
    success: boolean;
}