import { AdminUpdateTemplateInputDTO, AdminUpdateTemplateOutputDTO } from "../../dtos/settings/admin.updateTemplate.dto";

export interface IAdminUpdateEmailTemplateUsecase {
    execute(request: AdminUpdateTemplateInputDTO): Promise<AdminUpdateTemplateOutputDTO>
}