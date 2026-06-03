
export interface CompanyUsageDTO {
    company: string
    totalInterviews: number
    totalTests: number
}
export interface AdminCompanyUsegaeOutputDTO {
    usage: CompanyUsageDTO[]
}