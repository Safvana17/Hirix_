import { NotificationMapper } from "../../Application/Mappers/mapper.notification";
import { NotificationEntity } from "../../Domain/entities/notification.entity";
import { INotificationRepository } from "../../Domain/repositoryInterface/notification.repository";
import { INotification, NotificationModel } from "../database/Model/Notification";
import { BaseRepository } from "./base.repository";

export class NotificationRepository extends BaseRepository<NotificationEntity, INotification> implements INotificationRepository {
    constructor(){
        super(NotificationModel)
    }

    async findByRecipient(recipientId: string): Promise<NotificationEntity[] | null> {
        const documents = await this._model.find({recipientId}).sort({createdAt: -1})
        if(!documents) return null
        return documents.map(d => this.mapToEntity(d))
    }

    async markAsRead(id: string): Promise<void> {
        await this._model.findByIdAndUpdate(id, {isRead: true})
    }
    
    protected mapToEntity(doc: INotification): NotificationEntity {
        return NotificationMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: NotificationEntity): Partial<INotification> {
        return NotificationMapper.toDocument(entity)
    }
}