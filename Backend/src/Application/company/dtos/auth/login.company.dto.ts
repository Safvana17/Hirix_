export interface LoginCompanyInputDTO {
    email: string
    password: string
}

export interface LoginCompanyOutputDTO {
    accessToken: string
    refreshToken: string
    csrfToken: string
    company: {
        id: string,
        name: string,
        email: string,
        role: string,
        isAdminVerified: boolean;
        isProfileUpdated: boolean;
    }
}