import { JobRolesEntity } from "../../../../Domain/entities/JobRoles.entity";
import { AppError } from "../../../../Domain/errors/app.error";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CreateJobRolesInputDTO, CreateJobRolesOutputDTO } from "../../dtos/jobRoles/jobRoles.create.dto";
import { ICreateJobRolesUsecase } from "../../interfaces/jobRoles/iJobRols.create.usecase";

export class CreateJobRolesUsecase implements ICreateJobRolesUsecase {
    constructor(
        private _jobRolesRepository: IJobRepository
    ) {}

    async execute(request: CreateJobRolesInputDTO): Promise<CreateJobRolesOutputDTO> {
        const existing = await this._jobRolesRepository.findActiveByName(request.name)
        if(existing){
            throw new AppError(JobRoleMessages.error.ALREADY_EXIST, statusCode.CONFLICT)
        }

        if(request.experienceMin > request.experienceMax){
            throw new AppError(JobRoleMessages.error.INVALID_EXPERIENCE, statusCode.BAD_REQUEST)
        }
        
        const jobRole = new JobRolesEntity(
            "",
            request.name,
            request.skills,
            request.experienceMin,
            request.experienceMax,
            request.openings,
            true,
            false
        )

        await this._jobRolesRepository.create(jobRole)

        return { success: true }
    }
}