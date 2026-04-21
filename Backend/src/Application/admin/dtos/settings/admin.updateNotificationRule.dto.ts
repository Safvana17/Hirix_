import { NotificationRuleEntity } from "../../../../Domain/entities/notificationRule.entity";
import { NotificationChannel } from "../../../../Domain/enums/notification";

export interface AdminUpdateNotificationRuleInputDTO {
    id: string;
    templateKey: string;
    channel: NotificationChannel;
    isActive: boolean;
}

export interface AdminUpdateNotificationRuleOutputDTO {
    notificationRule: NotificationRuleEntity
}