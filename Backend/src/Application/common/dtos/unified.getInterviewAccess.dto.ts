import { InterviewJoinStatus } from "../../../Domain/enums/interview"
import userRole from "../../../Domain/enums/userRole.enum"

export interface UnifiedGetInterviewAccessInputDTO {
    token: string
    roomId: string
}

export interface UnifiedGetInterviewAccessOutputDTO {
    id: string
    name: string
    description: string
    jobRole: string
    interviewerName: string
    candidateName: string
    round: number
    role: userRole
    startTime: string
    endTime: string
    companyName: string
    status: InterviewJoinStatus
}