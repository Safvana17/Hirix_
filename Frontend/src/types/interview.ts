export type InterviewStatus = 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED'
export type InterviewResult = 'PENDING' | 'SELECTED' | 'REJECTED' | 'HOLD'
export type ModalMode = 'create' | 'edit' | 'view'

export interface Interview {
    id: string
    name: string
    description: string
    testCandidateId?: string
    candidateName: string
    candidateEmail: string
    interviewerName: string
    interviewerEmail: string
    testId: string
    jobRoleId: string
    companyId: string
    round: number
    scheduledStartTime: Date
    scheduledEndTime: Date
    interviewStatus: InterviewStatus
    result?: InterviewResult
    feedback?: string
    candidateToken: string
    interviewerToken: string
    roomId: string
}

export interface ScheduleInterviewPayload {
    id?: string
    name: string
    description: string
    testCandidateId?: string
    candidateName: string
    candidateEmail: string
    interviewerName: string
    interviewerEmail: string
    testId: string
    jobRoleId: string
    round: number
    startTime: Date
    endTime: Date
}

export interface GetAllInterviewsParams {
    search?: string
    status?: InterviewStatus
    page: number
    limit: number
}

export interface GetAllInterviewsResponse {
    interviews: Interview[]
    totalPages: number
    totalCount: number
}

export interface RescheduleInterviewArgs {
    startTime: string
    endTime: string
    id: string
}