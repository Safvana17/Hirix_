import { AdminCreateNotificationRuleInputDTO, AdminCreateNotificationRuleOutputDTO } from "../../dtos/settings/admin.createNotificationRule.dto";

export interface IAdminCreateNotificationRuleUsecase {
    execute(request: AdminCreateNotificationRuleInputDTO): Promise<AdminCreateNotificationRuleOutputDTO>
}