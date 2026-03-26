import { NextFunction, Request, Response } from "express";
import { ICompanyUpdateProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.updateProfile.usecase";
import { getCompanySchema, updateProfileSchema } from "../../validators/settingsValidator";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { logger } from "../../../../utils/logging/loger";
import { IGetCompanyProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.getCompany.usecase";

export class CompanySettingsController {
    constructor(
        private _updateCompanyProfileUsecase: ICompanyUpdateProfileUsecase,
        private _getCompanyProfileUsecase: IGetCompanyProfileUsecase

    ) {}

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            logger.info({req: req.body}, 'request')
            const id = Array.isArray(req.params.id)
               ? req.params.id[0]
               : req.params.id
            const parsed = updateProfileSchema.parse(req.body)
            
            const updatedCompany = await this._updateCompanyProfileUsecase.execute({id,...parsed})

            return res.status(statusCode.OK).json({
                success: true,
                message: settingsMessages.success.COMPANY_PROFILE_UPDATED,
                company: updatedCompany.company
            })
        } catch (error) {
            next(error)
        }
    }
    getCompanyProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            const parsed = getCompanySchema.parse({id})
            const result = await this._getCompanyProfileUsecase.execute(parsed)
            logger.info({result: result.company}, 'from controller')
            return res.status(statusCode.OK).json({
                success: true,
                company: result.company
            })

        } catch (error) {
            next(error)
        }
    }
}