import { AppError } from "../../../../Domain/errors/app.error";
import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { AdminUpdateTemplateInputDTO, AdminUpdateTemplateOutputDTO } from "../../dtos/settings/admin.updateTemplate.dto";
import { IAdminUpdateEmailTemplateUsecase } from "../../interfaces/settings/IAdmin.updateTemplate.usecase";

export class AdminUpdateTemplateUsecase implements IAdminUpdateEmailTemplateUsecase{
    constructor(
        private _templateRepository: ITemplateRepository,
        private _notificationRulesRepository: INotificationRuleRepository,
    ) {}

    async execute(request: AdminUpdateTemplateInputDTO): Promise<AdminUpdateTemplateOutputDTO> {
        const template = await this._templateRepository.findById(request.id)
        if(!template){
            throw new AppError(settingsMessages.error.TEMPLATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isUsed = await this._notificationRulesRepository.findByEvent(template.key)
        logger.info(isUsed, 'from usecase')
        if(request.status === 'Deactivate' && isUsed){
            throw new AppError(settingsMessages.error.ALRAEDY_IN_USE, statusCode.BAD_REQUEST)
        }

        if(template.isDeleted){
            throw new AppError(settingsMessages.error.DELETED_TEMPLATE, statusCode.BAD_REQUEST)
        }
        template.isActive = request.status === 'Activate'
        await this._templateRepository.update(template.id, template)
        return {
            id: template.id
        }
    }
}