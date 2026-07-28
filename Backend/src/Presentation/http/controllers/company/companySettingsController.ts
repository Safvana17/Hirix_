import { Request, Response } from "express";
import { ICompanyUpdateProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.updateProfile.usecase";
import { restoreAccountSchema } from "../../validators/settingsValidator";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { IGetCompanyProfileUsecase } from "../../../../Application/company/interfaces/settings/iCompany.getCompany.usecase";
import { IUploadCompanyProfileImage } from "../../../../Application/company/interfaces/settings/iCompany.uploadProfileImage.usecase";
import { AppError } from "../../../../Domain/errors/app.error";
import { FileUpload } from "../../../../Shared/types/fileUpload.type";
import { ICompanyChangePasswordUsecase } from "../../../../Application/company/interfaces/settings/iCompany.changePassword.usecase";
import { IDeleteAccountUsecase } from "../../../../Application/company/interfaces/settings/iCompany.deleteAccount.usecase";
import { ISendRestoreAccountEmailUsecase } from "../../../../Application/company/interfaces/settings/iCompany.sendRestoreAccountEmail.usecase";
import { IGetDeletedAccountDetailsUsecase } from "../../../../Application/company/interfaces/settings/iCompany.getDeletedAccountDetails.usecase";
import { IConfirmRestoreAccountUsecase } from "../../../../Application/company/interfaces/settings/iCompany.confirmRestoreAccount.usecase";
import { env } from "../../../../Infrastructure/config/env";
import { sendSuccess } from "../../utils/apiResponse";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { CompanyCertificateDTO } from "../../../../Application/company/dtos/settings/settings.company.dto";


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

    updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const companyId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id    
        const files = req.files as Express.Multer.File[]
        console.log("====== MULTER FILES ======");
console.log(
  files.map(file => ({
    fieldname: file.fieldname,
    originalname: file.originalname
  }))
);

console.log("FILES FIELDNAMES");
files.forEach(file => {
    console.log(file.fieldname, file.originalname);
});
        console.log("body",req.body)
        console.log("files", req.files)
const certificates = req.body.certificates.map(
    (cert: CompanyCertificateDTO, index: number) => {

        console.log("Searching for:", `certificates[${index}][certificateFile]`);

        return {
            id: cert.id,
            certificateType: cert.certificateType,
            certificateNumber: cert.certificateNumber,
            key: cert.key,
            certificateFile: files.find(file =>
                file.fieldname === `certificates[${index}][certificateFile]`
            )
        }
    }
);

        

        console.log("====== MAPPED CERTIFICATES ======");
console.log(certificates, { depth: null });
       
            // originalName: file?.originalname,
            // buffer: file?.buffer,
            // size: file?.size,
            // mimetype: file?.mimetype
        
        console.log('controller', certificates)
        // console.log(" body: ", req.body)     
        const updatedCompany = await this._updateCompanyProfileUsecase.execute({id: companyId, ...req.body, certificates})
        return sendSuccess(res, statusCode.OK, settingsMessages.success.COMPANY_PROFILE_UPDATED, updatedCompany.company)
    })

    getCompanyProfile = asyncHandler(async (req: Request, res: Response) => {
        const companyId = Array.isArray(req.params.id) 
              ? req.params.id[0]
              : req.params.id
        const result = await this._getCompanyProfileUsecase.execute({id: companyId})
        // console.log(result)
        return sendSuccess(res, statusCode.OK, '', result)
    })

    uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
        const companyId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id
        const multerFile = req.file
        if(!multerFile){
            throw new AppError(settingsMessages.error.IMAGE_REQUIRED, statusCode.BAD_REQUEST)
        }
        console.log('multer type: ', multerFile)
        const file: FileUpload = {
            originalname: multerFile.originalname,
            mimetype: multerFile.mimetype,
            size: multerFile.size,
            buffer: multerFile.buffer
        }
        console.log('type: ', file)
        const updatedCompany = await this._uploadCompanyProfileImage.execute({id: companyId, file})
        return sendSuccess(res, statusCode.OK, settingsMessages.success.COMPANY_PROFILE_UPDATED, updatedCompany.company)
    })

    changePassword = asyncHandler(async (req: Request, res: Response) => {
        const companyId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id
        await this._companyChangePassword.execute({id: companyId, ...req.body})
        return sendSuccess(res, statusCode.OK, settingsMessages.success.PASSWORD_CHANGED_SUCCESSFULYY)
    })

    deleteAccount = asyncHandler(async(req: Request, res: Response) => {
        const companyId = Array.isArray(req.params.id) 
            ? req.params.id[0]
            : req.params.id
        await this._deleteAccount.execute({id: companyId, ...req.body})
        return sendSuccess(res, statusCode.OK, settingsMessages.success.ACCOUNT_DELETED)
    })

    requestRestoreLink = asyncHandler(async (req: Request, res: Response) => {
        await this._sendRestoreAccountEmail.execute(req.body)
        return sendSuccess(res, statusCode.OK, settingsMessages.success.RESTORE_LINK_SEND_SUCCESSFULLY)
    })

    getDeletedAccountDetails = asyncHandler(async(req: Request, res: Response) => {
        const parsed = restoreAccountSchema.parse({token: req.query.token})
        const company = await this._getDeletedAccountDetails.execute({token: parsed.token})
        return sendSuccess(res, statusCode.OK, '', {company})
    })

    confirmRestoreAccount = asyncHandler(async (req: Request, res: Response) => {
        const parsed = restoreAccountSchema.parse({token: req.query.token})
        const {refreshToken, accessToken, csrfToken, company} = await this._confirmRestoreAccount.execute({token: parsed.token})
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
        return sendSuccess(res, statusCode.OK, settingsMessages.success.ACCOUNT_RESTORED_SUCCESSFULLY, {company})
    })
}