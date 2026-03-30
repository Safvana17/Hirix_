import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { JobRolesQueryDTO, PaginatedJobRolesDTO } from "../../dtos/jobRoles/jobRole.getAll.dto";
import { IGetAllJobRolesUsecase } from "../../interfaces/jobRoles/iJobRoles.getAll.usecase";

export class GetAllJobRolesUsecase implements IGetAllJobRolesUsecase {
    constructor(
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: JobRolesQueryDTO): Promise<PaginatedJobRolesDTO> {
        const {data, totalPages, totalCount} = await this._jobRoleRepository.findAllFiltered(request)
        return {
            jobRoles: data.map((d) => ({
                id: d.id,
                name: d.name,
                skills: d.skills,
                experienceMin: d.experienceMin,
                experienceMax: d.experienceMax,
                openings: d.openings,
                status: d.status
            })),
            totalCount,
            totalPages
        }
    }
}