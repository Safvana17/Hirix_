// import { InterviewJoinStatus } from "../../../Domain/enums/interview"
// import userRole from "../../../Domain/enums/userRole.enum"

export interface UnifiedJoinInterviewInputDTO {
    token: string
    roomId: string
}

export interface UnifiedJoinInterviewOutputDTO {
    // id: string
    // name: string
    // description: string
    // jobRole: string
    // interviewerName: string
    // candidateName: string
    // round: number
    // role: userRole
    // startTime: string
    // endTime: string
    // companyName: string
    // status: InterviewJoinStatus
    canJoin: boolean
}