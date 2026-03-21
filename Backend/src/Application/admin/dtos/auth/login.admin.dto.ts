import userRole from "../../../../Domain/enums/userRole.enum"

export interface LoginAdminInputDto {
    email: string,
    password: string
}

export interface LoginAdminOutputDTO {
    accessToken: string
    refreshToken: string
    csrfToken: string
    admin: {
        id: string
        email: string
        name: string
        role: userRole
    }
}