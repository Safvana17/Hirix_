import { AdminDeleteEmailTemplateInputDTO, AdminDeleteEmailTemplateOutputDTO } from "../../dtos/settings/admin.deleteTemplate.dto";

export interface IAdminDeleteTemplateUsecase{
    execute(request: AdminDeleteEmailTemplateInputDTO): Promise<AdminDeleteEmailTemplateOutputDTO>
}