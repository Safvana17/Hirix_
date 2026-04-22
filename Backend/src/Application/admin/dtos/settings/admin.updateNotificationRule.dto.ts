import { NotificationRuleEntity } from "../../../../Domain/entities/notificationRule.entity";

export interface AdminUpdateNotificationRuleInputDTO {
    id: string;
    templateKey: string;
    isActive: boolean;
}

export interface AdminUpdateNotificationRuleOutputDTO {
    notificationRule: NotificationRuleEntity
}