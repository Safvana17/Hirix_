import { AppError } from "../../../../Domain/errors/app.error";
import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminEditTemplateInputDTO, AdminEditTemplateOutputDTO } from "../../dtos/settings/admin.editTemplate.usecase";
import { IAdminEditTemplateUsecase } from "../../interfaces/settings/IAdmin.editTemplate.usecase";

export class AdminEditTemplateUsecase implements IAdminEditTemplateUsecase {
    constructor(
        private _templateRepository: ITemplateRepository
    ) {}

    async execute(request: AdminEditTemplateInputDTO): Promise<AdminEditTemplateOutputDTO> {
        const template = await this._templateRepository.findById(request.id)
        if(!template){
            throw new AppError(settingsMessages.error.TEMPLATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(template.key !== request.key){
            throw new AppError(settingsMessages.error.TEMPLATE_KEY_MISMATCH, statusCode.BAD_REQUEST)
        }
        template.name = request.name
        template.key = request.key
        template.channel = request.channel
        template.subject = request.subject
        template.body = request.body
        template.title = request.title ?? null

        const updatedTemplate = await this._templateRepository.update(template.id, template)

        return {
            template: updatedTemplate!
        }
    }
}