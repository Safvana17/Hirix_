import { NotificationRuleEntity } from "../../../../Domain/entities/notificationRule.entity";
import { NotificationChannel } from "../../../../Domain/enums/notification";


export interface AdminGetAllNotificationRuleInputDTO {
    search?: string
    channel?: NotificationChannel
    page: number
    limit: number
}
export interface AdminGetAllNotificationRuleOutputDTO {
    rules: NotificationRuleEntity[]
    totalPages: number
    totalCount: number
}