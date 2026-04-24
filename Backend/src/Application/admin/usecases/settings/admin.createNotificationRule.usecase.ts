import { NotificationRuleEntity } from "../../../../Domain/entities/notificationRule.entity";
import { AppError } from "../../../../Domain/errors/app.error";
import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminCreateNotificationRuleInputDTO, AdminCreateNotificationRuleOutputDTO } from "../../dtos/settings/admin.createNotificationRule.dto";
import { IAdminCreateNotificationRuleUsecase } from "../../interfaces/settings/IAdmin.createNotificationRule.usecase";

export class AdminCreateNotificationRuleUsecase implements IAdminCreateNotificationRuleUsecase {
    constructor(
        private _notificationRuleRepository: INotificationRuleRepository,
        private _templateRepository: ITemplateRepository,
    ) {}

    async execute(request: AdminCreateNotificationRuleInputDTO): Promise<AdminCreateNotificationRuleOutputDTO> {
        const template = await this._templateRepository.findByKey(request.templateKey)
        if(!template){
            throw new AppError(settingsMessages.error.TEMPLATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(template.channel !== request.channel){
            throw new AppError(settingsMessages.error.INVALID_NOTIFICATION_CHANNEL, statusCode.BAD_REQUEST)
        }
        const exixting = await this._notificationRuleRepository.findByEvent(request.event)
        for(let rule of exixting){
            if(rule.channel === request.channel && rule.templateKey === request.templateKey){
                throw new AppError(settingsMessages.error.EXISTING_NOTIFICATION_RULE, statusCode.CONFLICT)
            }
        }

        if(!template.isActive){
            throw new AppError(settingsMessages.error.INACTIVE_TEMPLATE, statusCode.BAD_REQUEST)
        }
        if(template.isDeleted){
            throw new AppError(settingsMessages.error.DELETED_TEMPLATE, statusCode.BAD_REQUEST)
        }

        const notificationRule = new NotificationRuleEntity(
            '',
            request.event,
            request.channel,
            request.templateKey,
            request.isActive ?? true,
            false
        )

        const newNotificationRule = await this._notificationRuleRepository.create(notificationRule)
        return{
            notificationRule: newNotificationRule
        }
    }
}