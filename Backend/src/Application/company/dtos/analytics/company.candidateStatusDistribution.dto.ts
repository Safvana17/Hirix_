import { MonthPeriod } from "../../../../Domain/enums/analytics"
import { CandidatePipelineStatus } from "../../../../Domain/enums/Test"

export interface CompanyCandidateStatusDistributionInputDTO {
    companyId: string
    month: MonthPeriod
}

export interface StatusDistributionDTO {
    status: CandidatePipelineStatus
    count: number
}


export interface CompanyCandidateStatusDistributionOutputDTO {
    distribution: StatusDistributionDTO[]
}