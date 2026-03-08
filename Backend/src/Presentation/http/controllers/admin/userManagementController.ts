import { NextFunction, Request, Response } from "express";
import { IAdminGetAllCandidates } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCandidates.usecase";
import { IAdminGetAllCompaniesUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCompanies.usecase";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { QuerySchema } from "../../validators/adminValidator";
import { logger } from "../../../../utils/logging/loger";
import { AdminCompanyQueryDTO } from "../../../../Application/admin/dtos/userManagement/getAllCompanies.admin.dto";

export class UserManagementController {
    constructor(
       private _getAllCompaniesUsecase: IAdminGetAllCompaniesUsecase,
       private _getAllCandidatesUsecase: IAdminGetAllCandidates
    ) { }
    
    getAllCompanies = async(req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info({Query: req.query})
            const parsed: AdminCompanyQueryDTO = QuerySchema.parse(req.query)
            logger.info({parsed: parsed})
            const companies = await this._getAllCompaniesUsecase.exexute(parsed)
            return res.status(statusCode.OK).json({
                success: true,
                companies
            })
        } catch (error) {
            next(error)
        }
    }

    getAllCandidates = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const candidates = await this._getAllCandidatesUsecase.execute()
            return res.status(statusCode.OK).json({
                success: true,
                candidates
            })
        } catch (error) {
            next(error)
        }
    }
}