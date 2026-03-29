import { NextFunction, Request, Response } from "express";
import { ICompanyUpdateProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.updateProfile.usecase";
import { changePasswordSchema, deleteAccountSchema, getCompanySchema, restoreAccountSchema, sendRestoreLinkSchema, updateProfileSchema, uploadProfileImageSchema } from "../../validators/settingsValidator";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { logger } from "../../../../utils/logging/loger";
import { IGetCompanyProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.getCompany.usecase";
import { IUploadCompanyProfileImage } from "../../../../Application/company/interfaces/settings/iCompany.uploadProfileImage.usecase";
import { AppError } from "../../../../Domain/errors/app.error";
import { FileUpload } from "../../../../Shared/types/fileUpload.type";
import { ICompanyChangePasswordUsecase } from "../../../../Application/company/interfaces/settings/iCompany.changePassword.usecase";
import { CompanyChangePasswordInputDTO } from "../../../../Application/company/dtos/settings/changePassword.company.dto";
import { ConfirmRestoreAccountInputDto, DeleteAccountInputDTO, GetDeletedAccountDetailsInputDTO, SendRestoreAccountEmailInputDTO } from "../../../../Application/company/dtos/settings/deleteAccount.company.dto";
import { IDeleteAccountUsecase } from "../../../../Application/company/interfaces/settings/iCompany.deleteAccount.usecase";
import { ISendRestoreAccountEmailUsecase } from "../../../../Application/company/interfaces/settings/iCompany.sendRestoreAccountEmail.usecase";
import { IGetDeletedAccountDetailsUsecase } from "../../../../Application/company/interfaces/settings/iCompany.getDeletedAccountDetails.usecase";
import { IConfirmRestoreAccountUsecase } from "../../../../Application/company/interfaces/settings/iCompany.confirmRestoreAccount.usecase";
import { env } from "../../../../Infrastructure/config/env";


export class CompanySettingsController {
    constructor(
        private _updateCompanyProfileUsecase: ICompanyUpdateProfileUsecase,
        private _getCompanyProfileUsecase: IGetCompanyProfileUsecase,
        private _uploadCompanyProfileImage: IUploadCompanyProfileImage,
        private _companyChangePassword: ICompanyChangePasswordUsecase,
        private _deleteAccount: IDeleteAccountUsecase,
        private _sendRestoreAccountEmail: ISendRestoreAccountEmailUsecase,
        private _getDeletedAccountDetails: IGetDeletedAccountDetailsUsecase,
        private _confirmRestoreAccount: IConfirmRestoreAccountUsecase

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

    deleteAccount = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Array.isArray(req.params.id) 
                  ? req.params.id[0]
                  : req.params.id
            const parsed = deleteAccountSchema.parse(req.body)
            const payload: DeleteAccountInputDTO = {
                id: id,
                reason: parsed.reason,
                feedback: parsed.reason,
                password: parsed.password
            }
            await this._deleteAccount.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: settingsMessages.success.ACCOUNT_DELETED
            })

        } catch (error) {
            next(error)
        }
    }
    requestRestoreLink = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = sendRestoreLinkSchema.parse(req.body)
            const payload: SendRestoreAccountEmailInputDTO = {
                email: parsed.email,
                role: parsed.role
            }

            await this._sendRestoreAccountEmail.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: settingsMessages.success.RESTORE_LINK_SEND_SUCCESSFULLY
            })
        } catch (error) {
            next(error)
        }
    }

    getDeletedAccountDetails = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = restoreAccountSchema.parse({token: req.query.token})
            const payload: GetDeletedAccountDetailsInputDTO = {
                token: parsed.token
            }

            const company = await this._getDeletedAccountDetails.execute(payload)
            return res.status(statusCode.OK).json({
                success: true,
                company
            })
        } catch (error) {
            next(error)
        }
    }

    confirmRestoreAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = restoreAccountSchema.parse({token: req.query.token})
            const payload: ConfirmRestoreAccountInputDto = {
                token: parsed.token
            }

            const {refreshToken, accessToken, csrfToken, company} = await this._confirmRestoreAccount.execute(payload)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: env.REFRESH_TOKEN_MAX_AGE,
                path: '/'
            })

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: env.ACCESS_TOKEN_MAX_AGE,
                path: '/'
            })

            res.cookie("XSRF-TOKEN", csrfToken, {
                httpOnly: false,
                sameSite: "lax",
                secure: true
            })
            return res.status(statusCode.OK).json({
                success: true,
                message:settingsMessages.success.ACCOUNT_RESTORED_SUCCESSFULLY ,
                company
            })
        } catch (error) {
            next(error)
        }
    }
}