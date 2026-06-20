import type { UserRole } from "../constants/role"
import type { CandidateSelectionStatus, CodingLanguage } from "./test"

export type InterviewStatus = 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED'
export type InterviewResult = 'PENDING' | 'SELECTED' | 'REJECTED' | 'HOLD'
export type ModalMode = 'create' | 'edit' | 'view'
export type InterviewJoinStatus = 'WAITING' | 'LIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED' | 'READY'

export interface Message {
    id: string
    senderId: string
    senderName: string
    text: string
    timeStamp: number
    isMe: boolean
}
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
    scheduledStartTime: string
    scheduledEndTime: string
    interviewStatus: InterviewStatus
    result?: InterviewResult
    feedback?: string
    candidateToken: string
    interviewerToken: string
    roomId: string
}

export interface GetInterviewByIdResponse {
        id: string
        name: string
        description: string
        candidateName: string
        interviewerName: string
        interviewStatus:InterviewStatus
        interviewResult: InterviewResult
        candidateStatus: CandidateSelectionStatus
        round: number
        candidateEmail: string
        interviewerEmail: string
        startTime: string
        endTime: string
        feedback?: string
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
    startTime: string
    endTime: string
}

export interface GetAllInterviewsParams {
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
    interviewStatus:InterviewStatus
    result: InterviewResult
    candidateStatus: CandidateSelectionStatus
    interviewerEmail: string
    round: number
    scheduledStartTime: string
    hasNextRound: boolean
    candidateEmail: string
    scheduledEndTime: string
    testId: string
    testCandidateId: string
    jobRoleId: string
    roomId: string
    interviewerToken: string
}

export interface GetAllInterviewsResponse {
    interviews: InterviewDTO[]
    totalPages: number
    totalCount: number
}

export interface RescheduleInterviewArgs {
    startTime: string
    endTime: string
    id: string
}

export interface GetInterviewAccessResponse {
    id: string
    name: string
    description: string
    jobRole: string
    interviewerName: string
    candidateName: string
    round: number
    role: UserRole
    startTime: string
    endTime: string
    companyName: string
    status: InterviewJoinStatus
}

export interface UpdateInterviewResultArgs {
    result: InterviewResult
    feedback: string
}

export interface InterviewCodeRunnerArgs {
    language: CodingLanguage
    sourceCode: string
    input?: string[]
}

export interface InterviewCodeRunnerResponse {
    stdout: string
    stderr: string
    error: string | null
    exitCode: number | null
}
