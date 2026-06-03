export interface CandidateDashboardSummeryInputDTO {
    candidateId: string
}


export interface DashbordSummeryDTO {
    totalQuestionsAttempted: number
    accuracy: number
    currentPlan: string
    totalTestAttended: number
}
export interface CandidateDashboardSummeryOutputDTO {
    summery: DashbordSummeryDTO
}