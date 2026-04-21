import { AppError } from "../../../../Domain/errors/app.error";
import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminUpdateNotificationRuleInputDTO, AdminUpdateNotificationRuleOutputDTO } from "../../dtos/settings/admin.updateNotificationRule.dto";
import { IAdminUpdateNotificationRuleUsecase } from "../../interfaces/settings/IAdmin.updateNotificationRule.usecase";

export class AdminUpdateNotificationRuleUsecase implements IAdminUpdateNotificationRuleUsecase{
    constructor(
        private _notificationRuleRepository: INotificationRuleRepository,
        private _templateRepository: ITemplateRepository
    ) {}

    async execute(request: AdminUpdateNotificationRuleInputDTO): Promise<AdminUpdateNotificationRuleOutputDTO> {
        const notificationRule = await this._notificationRuleRepository.findById(request.id)
        if(!notificationRule){
            throw new AppError(settingsMessages.error.NOTIFICATION_RULE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const template = await this._templateRepository.findByKey(request.templateKey)
        if(!template){
            throw new AppError(settingsMessages.error.TEMPLATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        // if(template.id !== request.id){
        //     throw new AppError(settingsMessages.error.INVALID_TEMPLATE_ID, statusCode.NOT_FOUND)
        // }
        if(template.channel !== request.channel){
            throw new AppError(settingsMessages.error.INVALID_NOTIFICATION_CHANNEL, statusCode.BAD_REQUEST)
        }

        notificationRule.channel = request.channel
        notificationRule.templateKey = request.templateKey
        notificationRule.isActive = request.isActive

        const updatedNotificationRule = await this._notificationRuleRepository.update(notificationRule.id, notificationRule)
        return {
            notificationRule: updatedNotificationRule!
        }

    }
}