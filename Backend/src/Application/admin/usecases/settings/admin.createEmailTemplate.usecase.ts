import { TemplateEntity } from "../../../../Domain/entities/Template.entity";
import { AppError } from "../../../../Domain/errors/app.error";
import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminCreateEmailTemplateInputDTO, AdminCreateEmailTemplateOutputDTO } from "../../dtos/settings/admin.createTemplate.dto";
import { IAdminCreateEmailTemplateUsecase } from "../../interfaces/settings/IAdmin.createEmailTemplate";

export class AdminCreateEmailTemplateUsecase implements IAdminCreateEmailTemplateUsecase {
    constructor(
        private _templateRepository: ITemplateRepository,
    ) {}

    async execute(request: AdminCreateEmailTemplateInputDTO): Promise<AdminCreateEmailTemplateOutputDTO> {
        const existing = await this._templateRepository.findByKey(request.key)
        if(existing){
            throw new AppError(settingsMessages.error.TEMPLATE_ALREADY_EXISTING, statusCode.NOT_FOUND)
        }
        const template = new TemplateEntity(
            '',
            request.key,
            request.name,
            request.channel,
            request.subject,
            request.title,
            request.body,
            true,
            false
        )
        const savedTemplate = await this._templateRepository.create(template)
        savedTemplate.footerText = request.footerText
        savedTemplate.ctaText = request.ctaText
        savedTemplate.ctaUrl = request.ctaUrl
        savedTemplate.showOtpBox = request.showOtpBox
        savedTemplate.otpLabel = request.otpLabel
        savedTemplate.expiryText = request.expiryText
        savedTemplate.supportText = request.supportText

        await this._templateRepository.update(savedTemplate.id, savedTemplate)
        return {
            success: true
        }
    }
}