import { NextFunction, Request, Response } from "express";
import { IAdminGetAllCandidates } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCandidates.usecase";
import { IAdminGetAllCompaniesUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCompanies.usecase";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { approveCompanySchema, QuerySchema, rejectCompanySchema, updateStatusSchema } from "../../validators/adminValidator";
import { logger } from "../../../../utils/logging/loger";
import { AdminCompanyQueryDTO } from "../../../../Application/admin/dtos/userManagement/getAllCompanies.admin.dto";
import { IAdminGetCompanyUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getCompany.usecase";
import { AdminRejectCompanyInputDTO, UpdataStatusInputDTO } from "../../../../Application/admin/dtos/userManagement/updateStatus.admin.dto";
import { IAdminUpdateCompanyStatusUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.updateCompanyStatus.usecase";
import { AdminCandidateQueryDTO } from "../../../../Application/admin/dtos/userManagement/getAllCandidate.admin.dto";
import { IAdminUpdateCandidateStatus } from "../../../../Application/admin/interfaces/userManagement/iAdmin.updateCandidateSttaus.usecase";
import { IAdminApproveCompanyUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.approveCompany.usecase";
import { IAdminRejectCompanyUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.rejectCompany.usecase";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";


export class UserManagementController {
    constructor(
       private _getAllCompaniesUsecase: IAdminGetAllCompaniesUsecase,
       private _getAllCandidatesUsecase: IAdminGetAllCandidates,
       private _getCompanyUsecase: IAdminGetCompanyUsecase,
       private _updateCompanyStatus: IAdminUpdateCompanyStatusUsecase,
       private _updateCandidateStatus: IAdminUpdateCandidateStatus,
       private _approveCompanyRegisterUsecase: IAdminApproveCompanyUsecase,
       private _rejectCompanyRegisterUsecase: IAdminRejectCompanyUsecase
    ) { }
    
    getAllCompanies = async(req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info({Query: req.query})
            const parsed: AdminCompanyQueryDTO = QuerySchema.parse(req.query)
            logger.info({parsed: parsed})
            const {companies, totalPages, totalCount} = await this._getAllCompaniesUsecase.exexute(parsed)
            return res.status(statusCode.OK).json({
                success: true,
                companies,
                totalCount,
                totalPages
            })
        } catch (error) {
            next(error)
        }
    }

    getAllCandidates = async(req: Request, res: Response, next: NextFunction) => {
        logger.info(`get all candidates hits11`)
        try {
            logger.info(`get all candidates hits`)
            const parsed: AdminCandidateQueryDTO = QuerySchema.parse(req.query)
            const { candidates, totalPages, totalCount} = await this._getAllCandidatesUsecase.execute(parsed)
            return res.status(statusCode.OK).json({
                success: true,
                candidates,
                totalCount,
                totalPages
            })
        } catch (error) {
            next(error)
        }
    }

    getCompanyById = async(req: Request<{id: string}>, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            const company = await this._getCompanyUsecase.execute({id: id})
            logger.info({company: company})
            return res.status(statusCode.OK).json({
                success: true,
                company
            })
        } catch (error) {
            next(error)
        }
    }
    updateCompanyStatus = async(req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info({Query: req.params, body: req.body})
            const id = req.params.id
            const parsed = updateStatusSchema.parse({id,status: req.body.status})
            const payload: UpdataStatusInputDTO = {
                id: parsed.id,
                status: parsed.status
            }

            const updatedCompany = await this._updateCompanyStatus.execute(payload)
            logger.info({updatedCompany: updatedCompany})
            return res.status(statusCode.OK).json({
                success: true,
                message: 'Status updated successfully',
                updatedCompany
            })

        } catch (error) {
            next(error)
        }
    }

    updateCandidateStatus = async(req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info({Query: req.params, body: req.body})
            const id = req.params.id
            const parsed = updateStatusSchema.parse({id,status: req.body.status})
            const payload: UpdataStatusInputDTO = {
                id: parsed.id,
                status: parsed.status
            }

            const updatedCandidate = await this._updateCandidateStatus.execute(payload)
            logger.info({updatedCandidate: updatedCandidate})
            return res.status(statusCode.OK).json({
                success: true,
                message: 'Status updated successfully',
                updatedCandidate
            })

        } catch (error) {
            next(error)
        }
    }

    approveCompany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            const parsed = approveCompanySchema.parse({id})
            const company = await this._approveCompanyRegisterUsecase.execute(parsed)

            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.ADMIN_APPROVED_COMPANY,
                company
            })

        } catch (error) {
            next(error)
        }
    }

    rejectCompany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            const parsed = rejectCompanySchema.parse({id, reason: req.body.reason})
            const payload: AdminRejectCompanyInputDTO = {
                id: parsed.id,
                reason: parsed.reason
            }
            const company =  await this._rejectCompanyRegisterUsecase.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.ADMIN_REJECTED_COMPANY,
                company
            })
            
        } catch (error) {
            next(error)
        }
    }
}