import { NextFunction, Request, Response } from "express";
import { IAdminGetAllCandidates } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCandidates.usecase";
import { IAdminGetAllCompaniesUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCompanies.usecase";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { QuerySchema } from "../../validators/adminValidator";
import { logger } from "../../../../utils/logging/loger";
import { AdminCompanyQueryDTO } from "../../../../Application/admin/dtos/userManagement/getAllCompanies.admin.dto";
import { IAdminGetCompanyUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getCompany.usecase";

export class UserManagementController {
    constructor(
       private _getAllCompaniesUsecase: IAdminGetAllCompaniesUsecase,
       private _getAllCandidatesUsecase: IAdminGetAllCandidates,
       private _getCompanyUsecase: IAdminGetCompanyUsecase
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

    getCompanyById = async(req: Request<{id: string}>, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            const company = await this._getCompanyUsecase.execute({id: id})
            return res.status(statusCode.OK).json({
                success: true,
                company
            })
        } catch (error) {
            next(error)
        }
    }
}