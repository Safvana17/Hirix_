export interface CompanyGetDashboardSummeryInputDTO {
    companyId: string
}

export interface CompanyGetDashboardSummeryOutputDTO {
    totalTests: number
    totalInterviews: number
    hiredCandidates: number
    currentPlan: string
}