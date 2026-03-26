export interface CompanyResetPasswordInputDTO {
    email: string;
    newPassword: string;
    confirmPassword: string;
    resetToken: string
}

export interface CompanyResetPasswordOutputDTO {
    success: boolean;
}