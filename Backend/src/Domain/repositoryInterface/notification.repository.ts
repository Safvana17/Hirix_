import { NotificationEntity } from "../entities/notification.entity";
import { IBaseRepository } from "./iBase.repository";

export interface INotificationRepository extends IBaseRepository<NotificationEntity>{
    findByRecipient(recipientId: string): Promise<NotificationEntity[]>
    markAsRead(id: string): Promise<void>
}