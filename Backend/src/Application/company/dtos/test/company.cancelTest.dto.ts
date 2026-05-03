export interface CompanyCancelTestInputDTO {
    companyId: string
    testId: string
    reason: string
}

export interface CompanyCancelTestOutputDTO {
    success: boolean
}