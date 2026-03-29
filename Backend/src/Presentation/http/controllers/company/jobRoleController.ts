import { NextFunction, Request, Response } from "express";
import { ICreateJobRolesUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRols.create.usecase";
import { createJobRoleScheama } from "../../validators/jobRoleValidator";
import { CreateJobRolesInputDTO } from "../../../../Application/company/dtos/jobRoles/jobRoles.create.dto";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";

export class JobRolesController {
    constructor (
        private _createJobRole: ICreateJobRolesUsecase
    ) {}

    createJobRole =async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = createJobRoleScheama.parse(req.body)
            const payload: CreateJobRolesInputDTO = {
                name: parsed.name,
                skills: parsed.skills,
                experienceMin: parsed.experienceMin,
                experienceMax: parsed.experienceMax,
                openings: parsed.openings
            }

            await this._createJobRole.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: JobRoleMessages.success.JOB_ROLE_CREATED
            })
        } catch (error) {
            next(error)
        }
    }
}