import { NotificationRuleEntity } from "../../Domain/entities/notificationRule.entity";
import { INotificationRule } from "../../Infrastructure/database/Model/NotificationRule";

export class NotificationRuleMapper {
    static toEntity(doc: INotificationRule): NotificationRuleEntity {
        const notificationRule = new NotificationRuleEntity(
            doc._id.toString(),
            doc.event,
            doc.channel,
            doc.templateKey,
            doc.isActive,
            doc.isDeleted
        )

        return notificationRule
    }

    static toDocument(entity: NotificationRuleEntity){
        return {
            event: entity.event,
            channel: entity.channel,
            templateKey: entity.templateKey,
            isActive: entity.isActive,
            isDeleted: entity.isDeleted
        }
    }
}