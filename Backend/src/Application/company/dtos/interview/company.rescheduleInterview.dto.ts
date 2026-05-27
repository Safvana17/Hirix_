export interface CompanyRescheduleInterviewInputDTO {
    startTime: Date
    endTime: Date
    interviewId: string
    companyId: string
}

export interface CompanyRescheduleInterviewOutputDTO {
    success: boolean
}