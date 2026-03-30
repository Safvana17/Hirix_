import { NextFunction, Request, Response } from "express";
import { ICreateJobRolesUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRols.create.usecase";
import { createJobRoleScheama, JobRoleQuerySchema } from "../../validators/jobRoleValidator";
import { CreateJobRolesInputDTO } from "../../../../Application/company/dtos/jobRoles/jobRoles.create.dto";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { QuerySchema } from "../../validators/adminValidator";
import { JobRolesQueryDTO } from "../../../../Application/company/dtos/jobRoles/jobRole.getAll.dto";
import { IGetAllJobRolesUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRoles.getAll.usecase";

export class JobRolesController {
    constructor (
        private _createJobRole: ICreateJobRolesUsecase,
        private _getAllJobRoles: IGetAllJobRolesUsecase
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
    getAllJobRoles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed: JobRolesQueryDTO = JobRoleQuerySchema.parse(req.query)
            const { jobRoles, totalCount, totalPages } = await this._getAllJobRoles.execute(parsed)
            return res.status(statusCode.OK).json({
                success: true,
                jobRoles,
                totalCount,
                totalPages
            })
        } catch (error) {
            next(error)
        }
    }
}