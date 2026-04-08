import { NextFunction, Request, Response } from "express";
import { ICreateJobRolesUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRols.create.usecase";
import { JobRoleQuerySchema } from "../../validators/jobRoleValidator";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { IGetAllJobRolesUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRoles.getAll.usecase";
import { IEditJobRoleUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRoles.edit.usecase";
import { IUpdateJobRoleStatusUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRole.updateStatus.usecase";
import { IDeleteJobRoleUsecase } from "../../../../Application/company/interfaces/jobRoles/iJobRole.delete.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";

export class JobRolesController {
    constructor (
        private _createJobRole: ICreateJobRolesUsecase,
        private _getAllJobRoles: IGetAllJobRolesUsecase,
        private _editJobRole: IEditJobRoleUsecase,
        private _updateJobRoleStatus: IUpdateJobRoleStatusUsecase,
        private _deleteJobRole: IDeleteJobRoleUsecase
    ) {}

    createJobRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user.id
        const jobRole = await this._createJobRole.execute({...req.body, userId})
        return sendSuccess(res, statusCode.OK, JobRoleMessages.success.JOB_ROLE_CREATED, {jobRole})
    })
    getAllJobRoles = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const parsed = JobRoleQuerySchema.parse(req.query)
        const { jobRoles, totalCount, totalPages } = await this._getAllJobRoles.execute({...parsed, userId: req.user.id})
        return sendSuccess(res, statusCode.OK, '', {jobRoles, totalCount, totalPages})
    })

    editJobRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const jobRoleId = Array.isArray(req.params.id) 
            ? req.params.id[0]
            : req.params.id
        const updatedJobRole = await this._editJobRole.execute({...req.body, id: jobRoleId, userId: req.user.id})
        return sendSuccess(res, statusCode.OK, '', {updatedJobRole})
    })

    updateStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const jobRoleId = req.params.id
        const updatedJobRole = await this._updateJobRoleStatus.execute({...req.body, id: jobRoleId})
        return sendSuccess(res, statusCode.OK, '', {updatedJobRole})
    })

    deleteJobRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const jobRoleId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id
        const deletedJobRole = await this._deleteJobRole.execute({id: jobRoleId})
        return sendSuccess(res, statusCode.OK, JobRoleMessages.success.JOB_ROLE_DELETED, {deletedJobRole})
    })
}