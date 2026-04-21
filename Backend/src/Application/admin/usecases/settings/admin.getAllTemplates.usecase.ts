import { ITemplateRepository } from "../../../../Domain/repositoryInterface/iTemplate.repository";
import { AdminGetAllTemplatesInputDTO, AdminGetAllTemplatesOutputDTO } from "../../dtos/settings/admin.getAllTemplate.dto";
import { IAdminGetAllTemplateUsecase } from "../../interfaces/settings/IAdmin.getAllTemplates.usecase";

export class AdminGetAllTemplatesUsecase implements IAdminGetAllTemplateUsecase {
    constructor(
        private _templateRepository: ITemplateRepository
    ) {}

    async execute(request: AdminGetAllTemplatesInputDTO): Promise<AdminGetAllTemplatesOutputDTO> {
        const { data, totalPages, totalCount } = await this._templateRepository.findAllFiltered(request)
        return {
            templates: data,
            totalPages,
            totalCount
        }
    }
}