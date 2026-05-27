export interface CompanyCancelInterviewInputDTO {
    companyId: string
    interviewId: string
    reason: string
}

export interface CompanyCancelInterviewOutputDTO {
    success: boolean
}