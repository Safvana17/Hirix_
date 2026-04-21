import { NotificationRuleEntity } from "../../../../Domain/entities/notificationRule.entity";
import { NotificationChannel } from "../../../../Domain/enums/notification";

export interface AdminCreateNotificationRuleInputDTO {
    event: string;
    channel: NotificationChannel;
    templateKey: string;
    isActive: boolean
}

export interface AdminCreateNotificationRuleOutputDTO {
    notificationRule: NotificationRuleEntity
}