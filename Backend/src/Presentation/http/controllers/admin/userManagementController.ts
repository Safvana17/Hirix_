import { NextFunction, Request, Response } from "express";
import { IAdminGetAllCandidates } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCandidates.usecase";
import { IAdminGetAllCompaniesUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCompanies.usecase";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { QuerySchema } from "../../validators/adminValidator";
import { logger } from "../../../../utils/logging/loger";
import { IAdminGetCompanyUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getCompany.usecase";
import { IAdminUpdateCompanyStatusUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.updateCompanyStatus.usecase";
import { IAdminUpdateCandidateStatus } from "../../../../Application/admin/interfaces/userManagement/iAdmin.updateCandidateSttaus.usecase";
import { IAdminApproveCompanyUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.approveCompany.usecase";
import { IAdminRejectCompanyUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.rejectCompany.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";


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
    
    getAllCompanies = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
            const parsed = QuerySchema.parse(req.query)
            const {companies, totalPages, totalCount} = await this._getAllCompaniesUsecase.exexute(parsed)
            return sendSuccess(res, statusCode.OK, '', {companies, totalCount, totalPages})
    })

    getAllCandidates = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
            const parsed = QuerySchema.parse(req.query)
            const { candidates, totalPages, totalCount} = await this._getAllCandidatesUsecase.execute(parsed)
            return sendSuccess(res, statusCode.OK, '', {candidates, totalCount, totalPages})
    })

    getCompanyById = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
            const companyId = Array.isArray(req.params.id)
                  ? req.params.id[0]
                  : req.params.id
            const company = await this._getCompanyUsecase.execute({id: companyId})
            return sendSuccess(res, statusCode.OK, '', company)
    })

    updateCompanyStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
            const companyId = Array.isArray(req.params.id)
                  ? req.params.id[0]
                  : req.params.id

            const updatedCompany = await this._updateCompanyStatus.execute({...req.body,id: companyId})
            logger.info({updatedCompany: updatedCompany})
            return sendSuccess(res, statusCode.OK, '', updatedCompany)
    })

    updateCandidateStatus = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
            const candidateId = Array.isArray(req.params.id)
                  ? req.params.id[0]
                  : req.params.id
            const updatedCandidate = await this._updateCandidateStatus.execute({...req.body, id: candidateId})
            return sendSuccess(res, statusCode.OK, '', updatedCandidate)
    })

    approveCompany =asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            const companyId = Array.isArray(req.params.id)
                  ? req.params.id[0]
                  : req.params.id
            const company = await this._approveCompanyRegisterUsecase.execute({id: companyId})

            return sendSuccess(res, statusCode.OK, '', company)
    })

    rejectCompany =asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            const companyId = Array.isArray(req.params.id)
                  ? req.params.id[0]
                  : req.params.id
            const company =  await this._rejectCompanyRegisterUsecase.execute({...req.body, id: companyId})

            return sendSuccess(res, statusCode.OK, '', company)
    })
}