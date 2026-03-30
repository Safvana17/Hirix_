import { JobRolesQueryDTO, PaginatedJobRolesDTO } from "../../dtos/jobRoles/jobRole.getAll.dto";

export interface IGetAllJobRolesUsecase {
    execute(request: JobRolesQueryDTO): Promise<PaginatedJobRolesDTO>
}