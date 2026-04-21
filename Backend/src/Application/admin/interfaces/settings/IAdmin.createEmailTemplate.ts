import { AdminCreateEmailTemplateInputDTO, AdminCreateEmailTemplateOutputDTO } from "../../dtos/settings/admin.createTemplate.dto";

export interface IAdminCreateEmailTemplateUsecase {
    execute(request: AdminCreateEmailTemplateInputDTO): Promise<AdminCreateEmailTemplateOutputDTO>
}