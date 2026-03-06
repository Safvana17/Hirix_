export interface LoginCompanyInputDTO {
    email: string
    password: string
}

export interface LoginCompanyOutputDTO {
    accessToken: string
    refreshToken: string
    company: {
        id: string,
        name: string,
        email: string,
        role: string
    }
}