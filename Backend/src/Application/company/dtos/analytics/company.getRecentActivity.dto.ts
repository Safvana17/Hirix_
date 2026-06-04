import { ActivityAction } from "../../../../Domain/enums/activityLog"
import { MonthPeriod } from "../../../../Domain/enums/analytics"
import userRole from "../../../../Domain/enums/userRole.enum"

export interface CompanyGetRecentActivityInputDTO{
    companyId: string
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
export interface CompanyGetRecentActivityOutputDTO {
    activities: RecentActivityDTO[]
    totalPages: number
    totalCount: number
}