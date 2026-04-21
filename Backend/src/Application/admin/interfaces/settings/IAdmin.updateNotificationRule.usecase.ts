import { AdminUpdateNotificationRuleInputDTO, AdminUpdateNotificationRuleOutputDTO } from "../../dtos/settings/admin.updateNotificationRule.dto";

export interface IAdminUpdateNotificationRuleUsecase {
    execute(request: AdminUpdateNotificationRuleInputDTO): Promise<AdminUpdateNotificationRuleOutputDTO>
}