import { NextFunction, Request, Response } from "express";
import { IAdminGetAllCandidates } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCandidates.usecase";
import { IAdminGetAllCompaniesUsecase } from "../../../../Application/admin/interfaces/userManagement/iAdmin.getAllCompanies.usecase";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class UserManagementController {
    constructor(
       private _getAllCompaniesUsecase: IAdminGetAllCompaniesUsecase,
       private _getAllCandidatesUsecase: IAdminGetAllCandidates
    ) { }
    
    getAllCompanies = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const companies = await this._getAllCompaniesUsecase.exexute()
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