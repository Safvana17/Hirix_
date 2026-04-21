import { AdminGetAllNotificationRuleOutputDTO } from "../../dtos/settings/admin.getAllNotificationRule.dto";

export interface IAdminGetAllNotificationRuleUsecase {
    execute(): Promise<AdminGetAllNotificationRuleOutputDTO>
}