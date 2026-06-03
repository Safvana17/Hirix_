import { MonthPeriod } from "../../../../Domain/enums/analytics"

export interface CompanyTestParticipationTrendInputDTO{
    companyId: string
    month: MonthPeriod
}

export interface TestTrendDTO{
    month: string
    attendedCandidates: number
}
export interface CompanyTestParticipationTrendOutputDTO {
    trend: TestTrendDTO[]
}