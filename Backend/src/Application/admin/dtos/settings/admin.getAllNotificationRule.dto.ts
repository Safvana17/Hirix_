import { NotificationRuleEntity } from "../../../../Domain/entities/notificationRule.entity";

export interface AdminGetAllNotificationRuleOutputDTO {
    rules: NotificationRuleEntity[]
}