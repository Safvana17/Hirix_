import { AdminGetAllNotificationRuleInputDTO, AdminGetAllNotificationRuleOutputDTO } from "../../dtos/settings/admin.getAllNotificationRule.dto";

export interface IAdminGetAllNotificationRuleUsecase {
    execute(request: AdminGetAllNotificationRuleInputDTO): Promise<AdminGetAllNotificationRuleOutputDTO>
}