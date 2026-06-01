import { RevenuePeriod } from "../../../../Domain/enums/analytics";

export interface AdminGetRevenueTrendByMonthInputDTO {
    month: RevenuePeriod
}


export interface RevenueTrendItemDTO {
    month: string
    revenue: number
}
export interface AdminGetRevenueTrendByMonthOutputDTO {
     trend: RevenueTrendItemDTO[]
}