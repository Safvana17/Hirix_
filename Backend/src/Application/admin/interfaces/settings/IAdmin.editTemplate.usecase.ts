import { AdminEditTemplateInputDTO, AdminEditTemplateOutputDTO } from "../../dtos/settings/admin.editTemplate.usecase";

export interface IAdminEditTemplateUsecase {
    execute(request: AdminEditTemplateInputDTO): Promise<AdminEditTemplateOutputDTO>
}