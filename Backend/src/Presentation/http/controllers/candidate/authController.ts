import { NextFunction, Request, Response } from "express";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { ICandidateRegisterUsecase } from "../../../../Application/candidate/interfaces/auth/ICandidateRegisterUsecase";
import { IVerifyRegisterCandidate } from "../../../../Application/candidate/interfaces/auth/IVerifyRegisterCandidate";
import { ICandidateLoginUsecase } from "../../../../Application/candidate/interfaces/auth/ICandidateLoginUsecase";
import { IResendOtpUsecase } from "../../../../Application/candidate/interfaces/auth/IResendOtpUsecase";
import { IForgotPasswordUsecase } from "../../../../Application/candidate/interfaces/auth/IForgotPasswordUsecase";
import { IResetPasswordUsecase } from "../../../../Application/candidate/interfaces/auth/IResetPasswordUsecase";
import { env } from "../../../../Infrastructure/config/env";
import { IGoogleLoginUsecase } from "../../../../Application/candidate/interfaces/auth/IGoogleLoginUsecase";
import userRole from "../../../../Domain/enums/userRole.enum";
import { ICandidateVerifyOtpForForgotPassswordUsecase } from "../../../../Application/candidate/interfaces/auth/IVerifyOtpForForgotPassword";
import { sendSuccess } from "../../utils/apiResponse";
import { asyncHandler } from "../../../../utils/asyncHandler";



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
    register = asyncHandler(async (req:Request, res: Response, next: NextFunction) => {
        await this._registerUsecase.execute(req.body)       
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_SEND_SUCCESS)
    })

    VerifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const savedCandidate = await this._verifyOtp.execute(req.body)
        return sendSuccess(res, statusCode.OK, authMessages.success.CANDIDATE_REGISTER_SUCCESS, {savedCandidate})
    })

    resendOtp = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
        await this._resendOtpUsecase.execute(req.body)
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_SEND_SUCCESS)
    })

    login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            const {refreshToken, accessToken,csrfToken, candidate} = await this._loginUsecase.execute(req.body)
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
            return sendSuccess(res, statusCode.OK, authMessages.success.CANDIDATE_LOGIN_SUCCESS, {candidate})
    })

    forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        await this._forgotPasswordUsecase.execute(req.body)    
        return sendSuccess(res, statusCode.OK, authMessages.success.RESET_PASSWORD_OTP_sEND)
    })
    VerifyOtpForForgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const {resetToken, email}= await this._verifyOtpForForgotPassword.execute(req.body)
        return sendSuccess(res, statusCode.OK, authMessages.success.OTP_VERIFIED, {resetToken, email})
    })

    resetPassword = asyncHandler(async ( req: Request, res: Response, next: NextFunction) => {
        await this._resetPasswordUsecase.execute(req.body)
        return sendSuccess(res, statusCode.OK, authMessages.success.PASSWORD_RESET)
    })

    googleLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) =>{
           const { token } = req.body
           const {refreshToken, accessToken, candidate} = await this._gooleLoginUsecase.execute(token, userRole.Candidate)
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
        return sendSuccess(res, statusCode.OK, authMessages.success.CANDIDATE_LOGIN_SUCCESS, {candidate})
    })
}