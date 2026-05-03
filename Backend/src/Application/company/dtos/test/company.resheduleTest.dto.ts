export interface CompanyResheduleTestInputDTO {
    companyId: string
    testId: string
    startTime: Date
    endTime: Date
}

export interface CompanyResheduleTestOutputDTO {
    success: boolean
}