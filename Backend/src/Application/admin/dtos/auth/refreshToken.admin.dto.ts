export interface AdminRefreshTokenInputDTO{
    token: string
}

export interface AdminRefreshTokenOutputDTO {
    adminId: string
    refreshToken: string
    accessToken: string
}