import { NextFunction, Request, Response } from "express";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { ICandidateRegisterUsecase } from "../../../../Application/candidate/interfaces/auth/ICandidateRegisterUsecase";
import { IVerifyRegisterCandidate } from "../../../../Application/candidate/interfaces/auth/IVerifyRegisterCandidate";
import { RegisterCandidateInputDTO } from "../../../../Application/candidate/dtos/register.candidate.dto";
import { forgotPasswordSchema, otpSchema, registerSchema, resendOtpSchema, resetPasswordSchema } from "../../validators/registerValidator";
import { verifyRegisterCandidateOtpInputDTO } from "../../../../Application/candidate/dtos/verifyRegister.candidate.dto";
import { googleLoginSchema, loginSchema } from "../../validators/loginValidator";
import { LoginCandidateInputDTO } from "../../../../Application/candidate/dtos/login.candidate.dto";
import { ICandidateLoginUsecase } from "../../../../Application/candidate/interfaces/auth/ICandidateLoginUsecase";
import { IResendOtpUsecase } from "../../../../Application/candidate/interfaces/auth/IResendOtpUsecase";
import { ResendOtpInputDTO } from "../../../../Application/candidate/dtos/resendotp.candidate.dto";
import { IForgotPasswordUsecase } from "../../../../Application/candidate/interfaces/auth/IForgotPasswordUsecase";
import { IResetPasswordUsecase } from "../../../../Application/candidate/interfaces/auth/IResetPasswordUsecase";
import { ForgotPasswordInputDTO } from "../../../../Application/candidate/dtos/forgotpassword.candidate.dto";
import { ResetPasswordInputDTO } from "../../../../Application/candidate/dtos/resetpassword.candidate.dto";
import { env } from "../../../../Infrastructure/config/env";
import { IGoogleLoginUsecase } from "../../../../Application/candidate/interfaces/auth/IGoogleLoginUsecase";
import userRole from "../../../../Domain/enums/userRole.enum";
import { logger } from "../../../../utils/logging/loger";
import { ICandidateVerifyOtpForForgotPassswordUsecase } from "../../../../Application/candidate/interfaces/auth/IVerifyOtpForForgotPassword";



export class CandidateAuthController {
    constructor(
        private _registerUsecase: ICandidateRegisterUsecase,
        private _verifyOtp: IVerifyRegisterCandidate,
        private _resendOtpUsecase: IResendOtpUsecase,
        private _loginUsecase: ICandidateLoginUsecase,
        private _forgotPasswordUsecase: IForgotPasswordUsecase,
        private _verifyOtpForForgotPassword: ICandidateVerifyOtpForForgotPassswordUsecase,
        private _resetPasswordUsecase: IResetPasswordUsecase,
        private _gooleLoginUsecase: IGoogleLoginUsecase,
    ) {}


    /**
     * 
     * @param req candidate register request with candidate details
     * @param res 
     * @param next 
     */
    register = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const parsed = registerSchema.parse(req.body)
            const payload: RegisterCandidateInputDTO = {
                name: parsed.name,
                email: parsed.email,
                password: parsed.password
            }

            await this._registerUsecase.execute(payload)
          
            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.OTP_SEND_SUCCESS
            })
        } catch (error) {
            next(error)
        }
    }

    VerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = otpSchema.parse(req.body)
            const payload: verifyRegisterCandidateOtpInputDTO = {
                email: parsed.email,
                otp: parsed.otp
            }

            const savedCandidate = await this._verifyOtp.execute(payload)

            return res.status(statusCode.CREATED).json({
                success: true,
                message: authMessages.success.CANDIDATE_REGISTER_SUCCESS,
                candidate: savedCandidate
            })

        } catch (error) {
            next(error)
        }
    }

    resendOtp = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = resendOtpSchema.parse(req.body)
            const payload: ResendOtpInputDTO = {
                email: parsed.email
            }

            await this._resendOtpUsecase.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.OTP_SEND_SUCCESS
            })

        } catch (error) {
            next(error)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: LoginCandidateInputDTO = loginSchema.parse(req.body)
            const {refreshToken, accessToken,csrfToken, candidate} = await this._loginUsecase.execute(payload)

            // const hashedToken = this._hashService.hashToken(refreshToken)
            // await this._candidateRepository.updateToken(candidate.id, hashedToken)

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
            
            res.cookie('XSRF-TOKEN', csrfToken, {
                httpOnly: false,
                secure: true,
                sameSite: "lax"
            })
            
            return res.status(statusCode.OK).json({
                success: true,
                candidate: candidate,
                message: authMessages.success.CANDIDATE_LOGIN_SUCCESS
            })
        } catch (error) {
            next(error)
        }
    }

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = forgotPasswordSchema.parse(req.body)
            const payload: ForgotPasswordInputDTO = {
                email: parsed.email
            }
            logger.info(`from forgot controller: ${payload}`)
            console.log('from forgot controller')
            await this._forgotPasswordUsecase.execute(payload)
            
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
            const payload: verifyRegisterCandidateOtpInputDTO = {
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

    resetPassword = async ( req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = resetPasswordSchema.parse(req.body)
            const payload: ResetPasswordInputDTO = {
                email: parsed.email,
                newPassword: parsed.newPassword,
                confirmPassword: parsed.confirmPassword,
                resetToken: parsed.resetToken
            }

            await this._resetPasswordUsecase.execute(payload)
            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.PASSWORD_RESET
            })
        } catch (error) {
            next(error)
        }
    }

    googleLogin = async (req: Request, res: Response, next: NextFunction) =>{
        try {
           const parsed = googleLoginSchema.parse(req.body)
           const payload = parsed.token
           const {refreshToken, accessToken, candidate} = await this._gooleLoginUsecase.execute(payload, userRole.Candidate)

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

           return res.status(statusCode.OK).json({
            success: true,
            message: authMessages.success.CANDIDATE_LOGIN_SUCCESS,
            candidate: candidate
           })
        } catch (error) {
            next(error)
        }
    }
}