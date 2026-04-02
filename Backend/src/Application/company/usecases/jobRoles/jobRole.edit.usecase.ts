import jobRoleStatus from "../../../../Domain/enums/jobRoleStatus";
import { AppError } from "../../../../Domain/errors/app.error";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { EditJobRolesInputDTO, EditJobRolesOutputDTO } from "../../dtos/jobRoles/jobRoles.edit.dto";
import { IEditJobRoleUsecase } from "../../interfaces/jobRoles/iJobRoles.edit.usecase";

export class EditJobRoleUsecase implements IEditJobRoleUsecase {
    constructor (
        private _jobRoleRepository: IJobRepository
    ) {}

    /**
     * 
     * @param request job role details- name, skills, experience and openings
     * @returns updated job role
     */

    async execute(request: EditJobRolesInputDTO): Promise<EditJobRolesOutputDTO> {
        const jobRole = await this._jobRoleRepository.findById(request.id)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const existing = await this._jobRoleRepository.findActiveByName(request.name)
        if(existing && existing.id !== request.id){
            throw new AppError(JobRoleMessages.error.ALREADY_EXIST, statusCode.CONFLICT)
        }

        if(request.experienceMax < request.experienceMin){
            throw new AppError(JobRoleMessages.error.INVALID_EXPERIENCE, statusCode.BAD_REQUEST)
        }

        if(jobRole.status === jobRoleStatus.Deleted){
            throw new AppError(JobRoleMessages.error.CANNOT_EDIT_DELETED_JOBROLE, statusCode.BAD_REQUEST)
        }

        if(request.openings < 1){
            throw new AppError(JobRoleMessages.error.INVALID_OPENINGS, statusCode.BAD_REQUEST)
        }

        jobRole.name = request.name
        jobRole.skills = request.skills
        jobRole.experienceMin = request.experienceMin
        jobRole.experienceMax = request.experienceMax
        jobRole.openings = request.openings

        const updatedJobRole = await this._jobRoleRepository.update(jobRole.id, jobRole)
        if(!updatedJobRole){
            throw new AppError(JobRoleMessages.error.EDIT_JOBROLE_FAILED, statusCode.SERVER_ERROR)
        }
        return {
            name: updatedJobRole.name,
            skills: updatedJobRole.skills,
            experienceMin: updatedJobRole.experienceMin,
            experienceMax: updatedJobRole.experienceMax,
            openings: updatedJobRole.openings,
            status: updatedJobRole.status
        }
    }
}