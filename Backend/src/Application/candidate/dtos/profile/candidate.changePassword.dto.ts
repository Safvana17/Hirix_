export interface CandidateChangePasswordInputDTO {
    candidateId: string
    oldPassword: string
    newPassword: string
}

export interface CandidateChangePasswordOutputDTO {
    success: boolean
}