import { InterviewEntity } from "../../../../Domain/entities/Interview"

export interface CompanyGetInterviewByIdInputDTO {
    companyId: string
    interviewId: string
}

export interface CompanyGetInterviewByIdOutputDTO {
    interview: InterviewEntity
}