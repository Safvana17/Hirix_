import { InterviewEntity } from "../../../../Domain/entities/Interview"
import { InterviewStatus } from "../../../../Domain/enums/interview"

export interface CompanyGetAllInterviewsInputDTO {
    companyId: string
    search?: string
    status?: InterviewStatus
    page: number
    limit: number
}

export interface CompanyGetAllInterviewsOutputDTO {
    interviews: InterviewEntity[]
    totalPages: number
    totalCount: number
}