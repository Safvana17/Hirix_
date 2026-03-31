import { UpdateJobRoleStatusInputDTO, UpdateJobRoleStatusOutputDTO } from "../../dtos/jobRoles/jobRole.updateStatus.dto";

export interface IUpdateJobRoleStatusUsecase {
    execute(request: UpdateJobRoleStatusInputDTO): Promise<UpdateJobRoleStatusOutputDTO>
}