import { NextFunction, Request, Response } from "express";
import { ICompanyUpdateProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.updateProfile.usecase";
import { updateProfileSchema } from "../../validators/settingsValidator";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { logger } from "../../../../utils/logging/loger";

export class CompanySettingsController {
    constructor(
        private _updateCompanyProfileUsecase: ICompanyUpdateProfileUsecase
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
                company: updatedCompany
            })
        } catch (error) {
            next(error)
        }
    }
}