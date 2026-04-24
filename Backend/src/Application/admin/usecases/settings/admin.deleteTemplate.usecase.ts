import { AppError } from "../../../../Domain/errors/app.error";
import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminDeleteEmailTemplateInputDTO, AdminDeleteEmailTemplateOutputDTO } from "../../dtos/settings/admin.deleteTemplate.dto";
import { IAdminDeleteTemplateUsecase } from "../../interfaces/settings/IAdmin.deleteTemplate.usecase";

export class AdminDeleteTemplateUsecase implements IAdminDeleteTemplateUsecase {
    constructor(
        private _templateRepository: ITemplateRepository,
        private _notificationRuleRepository: INotificationRuleRepository
    ) {}

    async execute(request: AdminDeleteEmailTemplateInputDTO): Promise<AdminDeleteEmailTemplateOutputDTO> {
        const template = await this._templateRepository.findById(request.id)
        if(!template){
            throw new AppError(settingsMessages.error.TEMPLATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(template.isDeleted){
            throw new AppError(settingsMessages.error.DELETED_TEMPLATE, statusCode.BAD_REQUEST)
        }

        const isUsed = await this._notificationRuleRepository.findByEvent(template.key)
        if(isUsed){
            throw new AppError(settingsMessages.error.ALRAEDY_IN_USE, statusCode.BAD_REQUEST)
        }

        template.isDeleted = true
        return {
            success: true
        }
    }
}