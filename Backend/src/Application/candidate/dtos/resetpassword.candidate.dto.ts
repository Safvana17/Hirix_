export interface ResetPasswordInputDTO {
    email: string;
    newPassword: string;
    confirmPassword: string;
    resetToken: string
}

export interface ResetPasswordOutputDTO {
    success: boolean;
}