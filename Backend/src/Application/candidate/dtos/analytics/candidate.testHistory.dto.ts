import { CandidatePipelineStatus } from "../../../../Domain/enums/Test"

export interface CandidateTestHistoryInputDTO {
    candidateId: string
    page: number
    limit: number
}

export interface TestHistoryDTO {
    company: string
    testName: string
    jobRole: string
    status: CandidatePipelineStatus
    date: Date
}

export interface CandidateTestHistoryOutputDTO {
    history: TestHistoryDTO[]
    totalPages: number
    totalCount: number
}