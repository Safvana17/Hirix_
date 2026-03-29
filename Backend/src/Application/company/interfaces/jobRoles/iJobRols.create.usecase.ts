import { CreateJobRolesInputDTO, CreateJobRolesOutputDTO } from "../../company/dtos/jobRoles/jobRoles.create.dto";

export interface ICreateJobRolesUsecase {
    execute(request: CreateJobRolesInputDTO): Promise<CreateJobRolesOutputDTO>
}