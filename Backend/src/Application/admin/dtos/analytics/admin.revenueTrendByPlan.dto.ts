import { TargetType } from "../../../../Domain/enums/subscription";

export interface AdminGetRevenueTrendByPlanInputDTO {
    type?: TargetType
}

export interface RevenueTrendDTO {
    plan: string
    type: TargetType
    revenue: number
}
export interface AdminGetRevenueTrendByPlanOutputDTO {
    trend: RevenueTrendDTO[]
}
