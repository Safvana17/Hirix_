import { UnifiedGetMyNotificationInputDTO, UnifiedGetMyNotificationOutputDTO } from "../dtos/unified.getMyNotification.dto";

export interface IUnifiedGetMyNotificationsUsecase{
    execute(request: UnifiedGetMyNotificationInputDTO): Promise<UnifiedGetMyNotificationOutputDTO>
}