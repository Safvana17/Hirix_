import { InterviewResult } from "../../../../Domain/enums/interview"

export interface CompanyUpdateInterviewResultInputDTO {
    companyId: string
    interviewId: string
    result: InterviewResult
    feedback: string
}

export interface CompanyUpdateInterviewResultOutputDTO {
    success: boolean
}