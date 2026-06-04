import { ActivityAction } from "../../../../Domain/enums/activityLog"
import { MonthPeriod } from "../../../../Domain/enums/analytics"
import userRole from "../../../../Domain/enums/userRole.enum"

export interface AdminGetRecentActivityInputDTO{
    month: MonthPeriod
    page: number
    limit: number
}

export interface RecentActivityDTO {
    date: string
    title: string
    targetType: string
    action: ActivityAction
    role: userRole
}
export interface AdminGetRecentActivityOutputDTO {
    activities: RecentActivityDTO[]
    totalPages: number
    totalCount: number
}