import { InterviewEntity } from "../../../../Domain/entities/Interview"

export interface CompanyScheduleInterviewInputDTO {
    companyId: string
    testId: string
    jobRoleId: string
    testCandidateId: string
    interviewerName: string
    interviewerEmail: string
    candidateName: string
    candidateEmail: string
    startTime: Date
    endTime: Date
    name: string
    description: string
    round: number
}

export interface CompanyScheduleInterviewOutputDTO {
    interview: InterviewEntity
}