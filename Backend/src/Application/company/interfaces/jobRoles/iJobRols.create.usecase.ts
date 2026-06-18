import { CreateJobRolesInputDTO, CreateJobRolesOutputDTO } from "../../dtos/jobRoles/jobRoles.create.dto";


export interface ICreateJobRolesUsecase {
    execute(request: CreateJobRolesInputDTO): Promise<CreateJobRolesOutputDTO>
}