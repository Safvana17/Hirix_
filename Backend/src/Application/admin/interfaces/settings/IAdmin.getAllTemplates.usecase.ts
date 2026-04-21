import { AdminGetAllTemplatesInputDTO, AdminGetAllTemplatesOutputDTO } from "../../dtos/settings/admin.getAllTemplate.dto";

export interface IAdminGetAllTemplateUsecase {
    execute(request: AdminGetAllTemplatesInputDTO): Promise<AdminGetAllTemplatesOutputDTO>
}