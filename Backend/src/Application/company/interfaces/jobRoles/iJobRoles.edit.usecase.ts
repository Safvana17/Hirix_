import { EditJobRolesInputDTO, EditJobRolesOutputDTO } from "../../dtos/jobRoles/jobRoles.edit.dto";

export interface IEditJobRoleUsecase {
    execute(request: EditJobRolesInputDTO): Promise<EditJobRolesOutputDTO>
}