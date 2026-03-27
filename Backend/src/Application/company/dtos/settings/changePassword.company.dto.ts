export interface CompanyChangePasswordInputDTO {
    id: string
    oldPassword: string
    newPassword: string
}

export interface CompanyChangePasswordOutputDTO {
    success: boolean
}