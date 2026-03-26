import userRole from '../../../Domain/enums/userRole.enum'

export interface VerifyCompanyInputDTO {
    token: string
}

export interface VerifyCompanyOutputDTO {
    company: {
        id: string,
        name: string, 
        email: string,
        role: userRole
    }
}