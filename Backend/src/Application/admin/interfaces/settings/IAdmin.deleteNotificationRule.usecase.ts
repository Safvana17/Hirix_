import { AdminDeleteNotificationRuleInputDTO, AdminDeleteNotificationRuleOutputDTO } from "../../dtos/settings/admin.notificationRule.dto";

export interface IAdminDeleteNotificationRuleUsecase {
    execute(request: AdminDeleteNotificationRuleInputDTO): Promise<AdminDeleteNotificationRuleOutputDTO>
}