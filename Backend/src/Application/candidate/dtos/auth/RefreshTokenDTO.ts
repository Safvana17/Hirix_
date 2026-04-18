export interface RefreshTokenInputDTO{
    token: string
}

export interface RefreshTokenOutputDTO {
    candidateId: string
    refreshToken: string
    accessToken: string
}