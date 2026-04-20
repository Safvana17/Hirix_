import { Types } from "mongoose";
import { NotificationEntity } from "../../Domain/entities/notification.entity";
import { INotification } from "../../Infrastructure/database/Model/Notification";

export class NotificationMapper {
    static toEntity(doc: INotification): NotificationEntity {
        const notification = new NotificationEntity (
            doc._id.toString(),
            doc.recipientId.toString(),
            doc.recipientType,
            doc.event,
            doc.title,
            doc.message,
            doc.isRead,
            doc.metaData
        )

        return notification
    }

    static toDocument(entity: NotificationEntity){
        return {
            recipientId: new Types.ObjectId(entity.recipientId) ,
            recipientType: entity.recipientType,
            event: entity.event,
            title: entity.title,
            message: entity.message,
            isRead: entity.isRead,
            metaDate: entity.metaData
        }
    }
}