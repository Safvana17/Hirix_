import { InterviewResult, InterviewStatus } from "../../../Domain/enums/interview"

export interface UnifiedEndInterviewInputDTO {
    token: string
    roomId: string
}

export interface UnifiedEndInterviewOutputDTO {
    id: string
    name: string
    description: string
    candidateName: string
    candidateEmail: string
    interviewerName: string
    interviewerEmail: string
    candidateToken: string
    interviewerToken: string
    scheduledStartTime: string
    scheduledEndTime: string
    companyId: string
    testCandidateId?: string
    testId: string
    jobRoleId: string
    round: number
    roomId: string
    result?: InterviewResult
    feedback?: string
    interviewStatus: InterviewStatus
}