import { AdminEditTemplateInputDTO, AdminEditTemplateOutputDTO } from "../../dtos/settings/admin.editTemplate.dto";

export interface IAdminEditTemplateUsecase {
    execute(request: AdminEditTemplateInputDTO): Promise<AdminEditTemplateOutputDTO>
}