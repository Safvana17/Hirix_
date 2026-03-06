import userRole from '../../../Domain/enums/userRole.enum'

export interface VerifyCompanyInputDTO {
    email: string
    otp: string
}

export interface VerifyCompanyOutputDTO {
    company: {
        id: string,
        name: string, 
        email: string,
        role: userRole
    }
}