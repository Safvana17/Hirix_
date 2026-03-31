import { NextFunction, Request, Response } from "express";
import { ICreateJobRolesUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRols.create.usecase";
import { createJobRoleScheama, deleteJobRoleSchema, EditJobRoleScheama, JobRoleQuerySchema, updateJobRoleSchema } from "../../validators/jobRoleValidator";
import { CreateJobRolesInputDTO } from "../../../../Application/company/dtos/jobRoles/jobRoles.create.dto";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { JobRolesQueryDTO } from "../../../../Application/company/dtos/jobRoles/jobRole.getAll.dto";
import { IGetAllJobRolesUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRoles.getAll.usecase";
import { EditJobRolesInputDTO } from "../../../../Application/company/dtos/jobRoles/jobRoles.edit.dto";
import { IEditJobRoleUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRoles.edit.usecase";
import { UpdateJobRoleStatusInputDTO } from "../../../../Application/company/dtos/jobRoles/jobRole.updateStatus.dto";
import { IUpdateJobRoleStatusUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRole.updateStatus.usecase";
import { IDeleteJobRoleUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRole.delete.usecase";
import { DeleteJobRoleInputDto } from "../../../../Application/company/dtos/jobRoles/jobRole.delete.dto";

export class JobRolesController {
    constructor (
        private _createJobRole: ICreateJobRolesUsecase,
        private _getAllJobRoles: IGetAllJobRolesUsecase,
        private _editJobRole: IEditJobRoleUsecase,
        private _updateJobRoleStatus: IUpdateJobRoleStatusUsecase,
        private _deleteJobRole: IDeleteJobRoleUsecase
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

            const jobRole = await this._createJobRole.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: JobRoleMessages.success.JOB_ROLE_CREATED,
                jobRole
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

    editJobRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Array.isArray(req.params.id) 
                ? req.params.id[0]
                : req.params.id
            const parsed = EditJobRoleScheama.parse(req.body)
            const payload: EditJobRolesInputDTO = {
                id: id,
                name: parsed.name,
                skills: parsed.skills,
                experienceMin: parsed.experienceMin,
                experienceMax: parsed.experienceMax,
                openings: parsed.openings,
            }

            const updatedJobRole = await this._editJobRole.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                updatedJobRole
            })
        } catch (error) {
            next(error)
        }
    }

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            const parsed = updateJobRoleSchema.parse({id, status: req.body.status})
            
            const payload: UpdateJobRoleStatusInputDTO = {
                id: parsed.id,
                status: parsed.status
            }

            const updatedJobRole = await this._updateJobRoleStatus.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                updatedJobRole
            })
        } catch (error) {
            next(error)
        }
    }

    deleteJobRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id
            const parsed = deleteJobRoleSchema.parse({id})
            const payload: DeleteJobRoleInputDto = {
                id: parsed.id
            }
            const deletedJobRole = await this._deleteJobRole.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: JobRoleMessages.success.JOB_ROLE_DELETED,
                deletedJobRole
            })
        } catch (error) {
            next(error)
        }
    }
}