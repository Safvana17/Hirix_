export interface ResetPasswordInputDTO {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ResetPasswordOutputDTO {
    success: boolean;
}