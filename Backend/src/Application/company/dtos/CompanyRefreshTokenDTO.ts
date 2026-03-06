export interface CompanyRefreshTokenInputDTO{
    token: string
}

export interface CompanyRefreshTokenOutputDTO {
    companyId: string
    refreshToken: string
    accessToken: string
}