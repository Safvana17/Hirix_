import { NextFunction, Request, Response } from "express";
import { ICompanyUpdateProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.updateProfile.usecase";
import { changePasswordSchema, getCompanySchema, updateProfileSchema, uploadProfileImageSchema } from "../../validators/settingsValidator";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { logger } from "../../../../utils/logging/loger";
import { IGetCompanyProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.getCompany.usecase";
import { IUploadCompanyProfileImage } from "../../../../Application/company/interfaces/settings/iCompany.uploadProfileImage.usecase";
import { AppError } from "../../../../Domain/errors/app.error";
import { FileUpload } from "../../../../Shared/types/fileUpload.type";
import { CompanyChangePasswordInputDTO } from "../../../../Application/company/dtos/settings/settings.company.dto";
import { ICompanyChangePasswordUsecase } from "../../../../Application/company/interfaces/settings/iCompany.changePassword.usecase";


export class CompanySettingsController {
    constructor(
        private _updateCompanyProfileUsecase: ICompanyUpdateProfileUsecase,
        private _getCompanyProfileUsecase: IGetCompanyProfileUsecase,
        private _uploadCompanyProfileImage: IUploadCompanyProfileImage,
        private _companyChangePassword: ICompanyChangePasswordUsecase,

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

    uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id
            const multerFile = req.file

            const parsed = uploadProfileImageSchema.parse({id})

            if(!multerFile){
                throw new AppError(settingsMessages.error.IMAGE_REQUIRED, statusCode.BAD_REQUEST)
            }

            const file: FileUpload = {
                filename: multerFile.filename,
                mimetype: multerFile.mimetype,
                size: multerFile.size,
                path: multerFile.path
            }

            const updatedCompany = await this._uploadCompanyProfileImage.execute({id: parsed.id, file})

            return res.status(statusCode.OK).json({
                success: true,
                message: settingsMessages.success.COMPANY_PROFILE_UPDATED,
                company: updatedCompany.company
            })
        } catch (error) {
            next(error)
        }
    }
    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id
            const parsed = changePasswordSchema.parse(req.body)
            const payload: CompanyChangePasswordInputDTO = {
                id: id,
                oldPassword: parsed.oldPassword,
                newPassword: parsed.newPassword
            }

            await this._companyChangePassword.execute(payload)
            return res.status(statusCode.OK).json({
                success: true,
                message: settingsMessages.success.PASSWORD_CHANGED_SUCCESSFULYY
            })
                    
        } catch (error) {
            next(error)
        }
    }
}