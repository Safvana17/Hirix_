import { NextFunction, Request, Response } from "express";
import { ICompanyRegisterUsecase } from "../../../../Application/company/interfaces/auth/ICompanyRegisterUsecase";
import { verifyRegisterCompanySchema } from "../../validators/registerValidator";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { IResendOtpCompanyUsecase } from "../../../../Application/company/interfaces/auth/IResendOtpUsecase";
import { ILoginCompanyUsecase } from "../../../../Application/company/interfaces/auth/ILoginCompanyUsecase";
import { ICompanyForgotPasswordUsecase } from "../../../../Application/company/interfaces/auth/ICompanyForgotPasswordUsecase";
import { ICompanyResetPasswordUsecase } from "../../../../Application/company/interfaces/auth/ICompanyResetPasswordUsecase";
import { env } from "../../../../Infrastructure/config/env";
import { ICompanyGoogleLoginUsecase } from "../../../../Application/company/interfaces/auth/ICompanyGoogleLoginUsecase";
import userRole from "../../../../Domain/enums/userRole.enum";
import { IVerifyRegisterCompanyUsecase } from "../../../../Application/company/interfaces/auth/ICompanyVerifyRegisterUsecase";
import { ICompanyVerifyOtpForForgotPasswordUsease } from "../../../../Application/company/interfaces/auth/ICompany.verifyOtpForForgotpassword.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { IVerifyRegisterCompanyOtpUsecase } from "../../../../Application/company/interfaces/auth/ICompany.verifyRegisterOtp.usecase";

export class CompanyAuthController {
    constructor(
        private _registerUsecase: ICompanyRegisterUsecase,
        private _resendOtpCompanyUsecase: IResendOtpCompanyUsecase,
        private _loginCompanyUsecase: ILoginCompanyUsecase,
        private _companyForgotPasswordUsecase: ICompanyForgotPasswordUsecase,
        private _verifyOtpForForgotPassword: ICompanyVerifyOtpForForgotPasswordUsease,
        private _companyResetPasswordUsecase: ICompanyResetPasswordUsecase,
        private _companyGoogleLogin: ICompanyGoogleLoginUsecase,
        private _verifyRegisterompany: IVerifyRegisterCompanyUsecase,
        private _verifyCompanyRegisterOtp: IVerifyRegisterCompanyOtpUsecase,
    ) {}

    register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await this._registerUsecase.execute(req.body)
        return sendSuccess(res, statusCode.OK, authMessages.success.COMPANY_REGISTER_PENDING)
    })

    verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const savedCompany = await this._verifyCompanyRegisterOtp.execute(req.body)
        return sendSuccess(res, statusCode.OK, '', {savedCompany})
    })

    verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const payload = verifyRegisterCompanySchema.parse({token: req.query.token})
        const savedCompany = await this._verifyRegisterompany.execute(payload)
        return sendSuccess(res, statusCode.OK, authMessages.success.COMPANY_EMAIL_VERIFIED, {savedCompany})
    })

    resendOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await this._resendOtpCompanyUsecase.execute(req.body)
        return sendSuccess(res, statusCode.OK, authMessages.success.COMPANY_REGISTER_SUCCESS)
    })

    login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            const {refreshToken, accessToken,csrfToken, company} = await this._loginCompanyUsecase.execute(req.body)

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
            
            return sendSuccess(res, statusCode.OK, authMessages.success.COMPANY_LOGIN_SUCCESS, {company})
    })

    forgotPassword = asyncHandler(async(req: Request, res: Response, next:NextFunction) => {
        await this._companyForgotPasswordUsecase.execute(req.body)          
        return sendSuccess(res, statusCode.OK, authMessages.success.RESET_PASSWORD_OTP_sEND)
    })

    VerifyOtpForForgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {resetToken, email}= await this._verifyOtpForForgotPassword.execute(req.body)
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_VERIFIED, {resetToken, email})
    })

    resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await this._companyResetPasswordUsecase.execute(req.body)
        return sendSuccess(res, statusCode.OK, authMessages.success.PASSWORD_RESET)
    })

    googleLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { token } = req.body
            const {refreshToken, accessToken, company} =await this._companyGoogleLogin.execute(token, userRole.Company)
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
            return sendSuccess(res, statusCode.OK, authMessages.success.COMPANY_LOGIN_SUCCESS, {company})          
    })
}