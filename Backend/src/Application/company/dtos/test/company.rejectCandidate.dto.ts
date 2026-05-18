export interface CompanyRejectCandidateInputDTO {
    candidateId: string
    testId: string
    companyId: string
}

export interface CompanyRejectCandidateOutputDTO {
    success: boolean
}