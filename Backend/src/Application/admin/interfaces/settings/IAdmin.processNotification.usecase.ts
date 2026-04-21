import { ProcessNotificationEventInputDTO, ProcessNotificationEventOutputDTO } from "../../dtos/settings/admin.notification.dto";

export interface IAdminProcessNotificationUsecase {
    execute(request: ProcessNotificationEventInputDTO): Promise<ProcessNotificationEventOutputDTO>
}