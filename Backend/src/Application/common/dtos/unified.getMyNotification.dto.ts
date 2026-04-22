import { NotificationEntity } from "../../../Domain/entities/notification.entity"
import userRole from "../../../Domain/enums/userRole.enum"

export interface UnifiedGetMyNotificationInputDTO {
    userId: string
    role: userRole
}

export interface UnifiedGetMyNotificationOutputDTO {
    notifications: NotificationEntity[]
}