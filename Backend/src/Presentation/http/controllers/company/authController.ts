import { NextFunction, Request, Response } from "express";
import { ICompanyRegisterUsecase } from "../../../../Application/company/interfaces/auth/ICompanyRegisterUsecase";
import { forgotPasswordSchema, otpSchema, registerSchema, resendOtpSchema, resetPasswordSchema, verifyRegisterCompanySchema } from "../../validators/registerValidator";
import { RegisterCompanyInputDTO } from "../../../../Application/company/dtos/auth/register.company.dto";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { ResendOtpCompanyInputDTO } from "../../../../Application/company/dtos/auth/resendOtp.company.dto";
import { IResendOtpCompanyUsecase } from "../../../../Application/company/interfaces/auth/IResendOtpUsecase";
import { googleLoginSchema, loginSchema } from "../../validators/loginValidator";
import { LoginCompanyInputDTO } from "../../../../Application/company/dtos/auth/login.company.dto";
import { ILoginCompanyUsecase } from "../../../../Application/company/interfaces/auth/ILoginCompanyUsecase";
import { ICompanyForgotPasswordUsecase } from "../../../../Application/company/interfaces/auth/ICompanyForgotPasswordUsecase";
import { ICompanyResetPasswordUsecase } from "../../../../Application/company/interfaces/auth/ICompanyResetPasswordUsecase";
import { CompanyForgotPasswordInputDTO } from "../../../../Application/company/dtos/auth/forgotPassword.company.dto";
import { CompanyResetPasswordInputDTO } from "../../../../Application/company/dtos/auth/resetPassword.company.dto";
import { env } from "../../../../Infrastructure/config/env";
import { ICompanyGoogleLoginUsecase } from "../../../../Application/company/interfaces/auth/ICompanyGoogleLoginUsecase";
import userRole from "../../../../Domain/enums/userRole.enum";
import { IVerifyRegisterCompanyUsecase } from "../../../../Application/company/interfaces/auth/ICompanyVerifyRegisterUsecase";
import { VerifyCompanyOtpForForgotPasswordInputDTO } from "../../../../Application/company/dtos/auth/verifyOtpForForgotpassword.company.dto";
import { ICompanyVerifyOtpForForgotPasswordUsease } from "../../../../Application/company/interfaces/auth/ICompany.verifyOtpForForgotpassword.usecase";

export class CompanyAuthController {
    constructor(
        private _registerUsecase: ICompanyRegisterUsecase,
        private _resendOtpCompanyUsecase: IResendOtpCompanyUsecase,
        private _loginCompanyUsecase: ILoginCompanyUsecase,
        private _companyForgotPasswordUsecase: ICompanyForgotPasswordUsecase,
        private _verifyOtpForForgotPassword: ICompanyVerifyOtpForForgotPasswordUsease,
        private _companyResetPasswordUsecase: ICompanyResetPasswordUsecase,
        private _companyGoogleLogin: ICompanyGoogleLoginUsecase,
        private _verifyRegisterompany: IVerifyRegisterCompanyUsecase
    ) {}

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = registerSchema.parse(req.body)
            const payload: RegisterCompanyInputDTO = {
                name: parsed.name,
                email: parsed.email,
                password: parsed.password
            }

            await this._registerUsecase.execute(payload)
            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.COMPANY_REGISTER_PENDING
            })

            
        } catch (error) {
            next(error)
        }
    }

    verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = verifyRegisterCompanySchema.parse({token: req.query.token})

            const savedCompany = await this._verifyRegisterompany.execute(payload)

            return res.status(statusCode.CREATED).json({
                success: true,
                company: savedCompany,
                message: authMessages.success.COMPANY_EMAIL_VERIFIED
            })

        } catch (error) {
            next(error)
        }
    }

    resendOtp = async (req: Request, res: Response, next: NextFunction) => {
            try {
                const parsed = resendOtpSchema.parse(req.body)
                const payload: ResendOtpCompanyInputDTO = {
                    email: parsed.email
                }

                await this._resendOtpCompanyUsecase.execute(payload)
                return res.status(statusCode.OK).json({
                    success: true,
                    message: authMessages.success.COMPANY_REGISTER_SUCCESS
                })

                
            } catch (error) {
                next(error)
            }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = loginSchema.parse(req.body)
            const payload: LoginCompanyInputDTO = {
                email: parsed.email,
                password: parsed.password
            }

            const {refreshToken, accessToken,csrfToken, company} = await this._loginCompanyUsecase.execute(payload)

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
                company: company,
                message: authMessages.success.COMPANY_LOGIN_SUCCESS
            })
        } catch (error) {
            next(error)
        }
    }

    forgotPassword = async(req: Request, res: Response, next:NextFunction) => {
        try {
            const parsed = forgotPasswordSchema.parse(req.body)
            const payload: CompanyForgotPasswordInputDTO = {
                email: parsed.email
            }

            await this._companyForgotPasswordUsecase.execute(payload)
            
            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.RESET_PASSWORD_OTP_sEND
            })
        } catch (error) {
            next(error)
        }
    }

    VerifyOtpForForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = otpSchema.parse(req.body)
            const payload: VerifyCompanyOtpForForgotPasswordInputDTO = {
                email: parsed.email,
                otp: parsed.otp
            }

            const {resetToken, email}= await this._verifyOtpForForgotPassword.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.OTP_VERIFIED,
                resetToken,
                email
            })

        } catch (error) {
            next(error)
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = resetPasswordSchema.parse(req.body)
            const payload: CompanyResetPasswordInputDTO = {
                email: parsed.email,
                newPassword: parsed.newPassword,
                confirmPassword: parsed.confirmPassword,
                resetToken: parsed.resetToken
            }

            await this._companyResetPasswordUsecase.execute(payload)
            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.PASSWORD_RESET
            })
        } catch (error) {
            next(error)
        }
    }

    googleLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = googleLoginSchema.parse(req.body)
            const payload = parsed.token

            const {refreshToken, accessToken, company} =await this._companyGoogleLogin.execute(payload, userRole.Company)

            res.cookie('refershToken', refreshToken, {
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
            
            return res.status(statusCode.OK).json({
                success: true,
                company: company,
                message: authMessages.success.COMPANY_LOGIN_SUCCESS
            })           

        } catch (error) {
            next(error)
        }
    }
}