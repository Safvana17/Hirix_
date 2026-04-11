import userRole from "../../../../Domain/enums/userRole.enum"

export interface verifyRegisterCompanyOtpInputDTO {
    email: string
    otp: string
}

export interface verifyRegisterCompanyOtpOutputDTO {
    company: {
        id: string,
        name: string,
        email: string,
        role: userRole
    }
}