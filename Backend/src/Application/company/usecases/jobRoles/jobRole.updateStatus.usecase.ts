import { AppError } from "../../../../Domain/errors/app.error";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { UpdateJobRoleStatusInputDTO, UpdateJobRoleStatusOutputDTO } from "../../dtos/jobRoles/jobRole.updateStatus.dto";
import { IUpdateJobRoleStatusUsecase } from "../../interfaces/jobRoles/iJobRole.updateStatus.usecase";

export class UpdateJobRoleStatusUsecase implements IUpdateJobRoleStatusUsecase{
    constructor(
        private _jobRoleRepository: IJobRepository
    ) {}

    /**
     * 
     * @param request job role id and status
     * @returns job role id and status
     */
    async execute(request: UpdateJobRoleStatusInputDTO): Promise<UpdateJobRoleStatusOutputDTO> {
        const jobRole = await this._jobRoleRepository.findById(request.id)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isActive = request.status === 'Active'
        jobRole.status = request.status
        jobRole.isActive = isActive
        const updatedJobRole = await this._jobRoleRepository.update(jobRole.id, jobRole)

        if(!updatedJobRole){
            throw new AppError(JobRoleMessages.error.UPDATE_JOBROLE_STATUS_FAILED, statusCode.SERVER_ERROR)
        }
        return { 
            id: updatedJobRole.id,
            status: updatedJobRole.status
        }
    }
}