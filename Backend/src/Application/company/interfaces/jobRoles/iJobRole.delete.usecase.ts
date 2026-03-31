import { DeleteJobRoleInputDto, DeleteJobRoleOutputDTO } from "../../dtos/jobRoles/jobRole.delete.dto";

export interface IDeleteJobRoleUsecase {
    execute(request: DeleteJobRoleInputDto): Promise<DeleteJobRoleOutputDTO>
}