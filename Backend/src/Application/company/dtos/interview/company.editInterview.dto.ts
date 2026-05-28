export interface CompanyEditInterviewInputDTO {
    interviewId: string
    companyId: string
    interviewerName: string
    interviewerEmail: string
    candidateName: string
    candidateEmail: string
    name: string
    description: string
}

export interface CompanyEditInterviewOutputDTO {
    success: boolean
}