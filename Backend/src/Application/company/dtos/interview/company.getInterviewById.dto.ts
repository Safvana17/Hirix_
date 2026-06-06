import { InterviewResult, InterviewStatus } from "../../../../Domain/enums/interview"
import { CandidatePipelineStatus } from "../../../../Domain/enums/Test"

export interface CompanyGetInterviewByIdInputDTO {
    companyId: string
    interviewId: string
}

export interface CompanyGetInterviewByIdOutputDTO {
    interview: {
        id: string
        name: string
        description: string
        candidateName: string
        interviewerName: string
        interviewStatus:InterviewStatus
        interviewResult: InterviewResult
        candidateStatus: CandidatePipelineStatus
        round: number
        candidateEmail: string
        interviewerEmail: string
        startTime: string
        endTime: string
        feedback?: string

    }
}