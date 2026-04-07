import { Request, Response, NextFunction } from "express"
import { statusCode } from "../../../../Shared/Enumes/statusCode"
import  { authMessages } from '../../../../Shared/constsnts/messages/authMessages'
import { IUnifiedGetMeUsecase } from "../../../../Application/common/interfaces/IUnifiedGetMeUsecase"
import { IUnifiedTokenRefreshUsecase } from "../../../../Application/common/interfaces/IUnifiedTokenRefreshUsecase"
import { env } from "../../../../Infrastructure/config/env"
import { IUnifiedLogoutUsecase } from "../../../../Application/common/interfaces/IUnifiedLogoutUsecase"
import { logger } from "../../../../utils/logging/loger"
import { asyncHandler } from "../../../../utils/asyncHandler"
import { sendSuccess } from "../../utils/apiResponse"

export class UnifiedAuthController {
    constructor(
        private _unifiedGetMeUsecase: IUnifiedGetMeUsecase,
        private _unifiedRefreshTokenUsecase: IUnifiedTokenRefreshUsecase,
        private _unifiedLogoutUsecase: IUnifiedLogoutUsecase
    ) {}

    getMe = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
            const userId = req.user?.id
            const role = req.user?.role

            if(!req.user){
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: authMessages.error.UNAUTHORIZED
                })
            }
            const user = await this._unifiedGetMeUsecase.execute({id: userId, role: role})
            return sendSuccess(res, statusCode.OK, '', user)
    })
    refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            const refreshToken = req.cookies.refreshToken
            logger.info(`Refresh cookie:${req.cookies.refreshToken}`)

            const tokens = await this._unifiedRefreshTokenUsecase.execute({token: refreshToken})
        
            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'lax',
                maxAge: env.REFRESH_TOKEN_MAX_AGE,
                path: '/'
            })

            res.cookie('accessToken', tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: env.ACCESS_TOKEN_MAX_AGE,
                path: '/'
            })

            res.cookie("XSRF-TOKEN", tokens.csrfToken, {
                httpOnly: false,
                secure: true,
                sameSite: "lax"
            })

            return sendSuccess(res, statusCode.OK, authMessages.success.TOKEN_REFRESHED)
    })
    logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            const accessToken = req.cookies.accessToken
            const refreshToken = req.cookies.refreshToken
            await this._unifiedLogoutUsecase.execute(refreshToken, accessToken)

            res.clearCookie('refreshToken', {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === ' production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production'
            })

            res.clearCookie('accessToken', {
                httpOnly: true,
                sameSite: process.env.NODE_ENV === ' production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production'
            })

            return res.status(statusCode.NO_CONTENT).json({
                success: true,
                message: authMessages.success.CANDIDATE_LOGGEDOUT_SUCCESS
            })
    })
}