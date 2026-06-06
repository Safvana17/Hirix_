import { InterviewResult, InterviewStatus } from "../../../../Domain/enums/interview"
import { CandidatePipelineStatus } from "../../../../Domain/enums/Test"

export interface CompanyGetAllInterviewsInputDTO {
    companyId: string
    search?: string
    status?: InterviewStatus
    page: number
    limit: number
}

export interface InterviewDTO {
    _id: string
    name: string
    description: string
    candidateName: string
    interviewerName: string
    candidateEmail: string
    interviewerEmail: string
    interviewStatus:InterviewStatus
    result: InterviewResult
    candidateStatus: CandidatePipelineStatus
    round: number
    scheduledStartTime: string
    scheduledEndTime: string
    hasNextRound: boolean
    testId: string
    testCandidateId: string
    jobRoleId: string
    roomId: string
    interviewerToken: string
}

export interface CompanyGetAllInterviewsOutputDTO {
    interviews: InterviewDTO[]
    totalPages: number
    totalCount: number
}