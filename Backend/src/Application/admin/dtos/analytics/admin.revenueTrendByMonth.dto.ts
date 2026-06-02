import { MonthPeriod } from "../../../../Domain/enums/analytics";

export interface AdminGetRevenueTrendByMonthInputDTO {
    month: MonthPeriod
}


export interface RevenueTrendItemDTO {
    month: string
    revenue: number
}
export interface AdminGetRevenueTrendByMonthOutputDTO {
    trend: RevenueTrendItemDTO[]
}