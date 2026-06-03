import { MonthPeriod } from "../../../../Domain/enums/analytics";

export interface AdminCandidateParticipationCountInputDTO {
    month: MonthPeriod
}

export interface ParticipationTRendDTO {
    totalCandidates: number
    passedCount: number
    rejectedCount: number
    month: string
}
export interface AdminCandidateParticipationCountOutputDTO {
    trend: ParticipationTRendDTO[]
}