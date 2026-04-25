import { AppError } from "../../../../Domain/errors/app.error";
import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminDeleteNotificationRuleInputDTO, AdminDeleteNotificationRuleOutputDTO } from "../../dtos/settings/admin.notificationRule.dto";
import { IAdminDeleteNotificationRuleUsecase } from "../../interfaces/settings/IAdmin.deleteNotificationRule.usecase";

export class AdminDeleteNotificationRuleUsecase implements IAdminDeleteNotificationRuleUsecase{
    constructor(
        private _notificationRuleRepository: INotificationRuleRepository
    ) {}

    async execute(request: AdminDeleteNotificationRuleInputDTO): Promise<AdminDeleteNotificationRuleOutputDTO> {
        const rule = await this._notificationRuleRepository.findById(request.id)
        if(!rule){
            throw new AppError(settingsMessages.error.NOTIFICATION_RULE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(rule.isDeleted) {
            throw new AppError(settingsMessages.error.DELETED_NOTIFICATION_RULE, statusCode.BAD_REQUEST)
        }

        rule.isDeleted = true
        return {
            success: true
        }
    }
}