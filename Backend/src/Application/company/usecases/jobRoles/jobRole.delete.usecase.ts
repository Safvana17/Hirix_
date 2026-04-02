import jobRoleStatus from "../../../../Domain/enums/jobRoleStatus";
import { AppError } from "../../../../Domain/errors/app.error";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { DeleteJobRoleInputDto, DeleteJobRoleOutputDTO } from "../../dtos/jobRoles/jobRole.delete.dto";
import { IDeleteJobRoleUsecase } from "../../interfaces/jobRoles/iJobRole.delete.usecase";

export class DeleteJobRoleUsecase implements IDeleteJobRoleUsecase {
    constructor(
        private _jobRoleRepository: IJobRepository
    ) {}

    /**
     * 
     * @param request job role id
     * @returns job role id
     */
    async execute(request: DeleteJobRoleInputDto): Promise<DeleteJobRoleOutputDTO> {
        const jobRole = await this._jobRoleRepository.findById(request.id)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        jobRole.status = jobRoleStatus.Deleted
        jobRole.isDeleted = true

        const deletedJobRole = await this._jobRoleRepository.update(jobRole.id, jobRole)
        if(!deletedJobRole){
            throw new AppError(JobRoleMessages.error.FAILED_DELETE_JOBROLE, statusCode.SERVER_ERROR)
        }
        return {
            success: true,
            id: deletedJobRole.id
        }
    }
}