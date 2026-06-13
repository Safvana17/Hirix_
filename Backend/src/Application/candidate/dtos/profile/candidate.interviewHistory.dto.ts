import { InterviewStatus } from "../../../../Domain/enums/interview"

export interface CandidateInterviewHistoryInputDTO {
    candidateId: string
    page: number
    limit: number
}

export interface InterviewHistoryDTO {
    company: string
    interviewName: string
    jobRole: string
    status: InterviewStatus
    interviewrName:string
    date: Date
}

export interface CandidateTInterviewHistoryOutputDTO {
    history: InterviewHistoryDTO[]
    totalPages: number
    totalCount: number
}