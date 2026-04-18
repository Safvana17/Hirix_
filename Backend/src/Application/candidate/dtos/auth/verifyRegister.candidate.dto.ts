import userRole from "../../../../Domain/enums/userRole.enum"

export interface verifyRegisterCandidateOtpInputDTO {
    email: string
    otp: string
}

export interface verifyRegisterCandidateOtpOutputDTO {
    candidate: {
        id: string,
        name: string,
        email: string,
        role: userRole
    }
}