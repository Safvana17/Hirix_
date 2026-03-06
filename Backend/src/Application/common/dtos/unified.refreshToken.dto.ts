
export interface UnifiedRefreshTokenInputDTO{
    token: string
}

export interface UnifiedRefreshTokenOutputDTO {
    userId: string
    refreshToken: string
    accessToken: string
}