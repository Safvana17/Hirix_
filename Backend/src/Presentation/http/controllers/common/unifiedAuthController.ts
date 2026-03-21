import { Request, Response, NextFunction } from "express"
import { statusCode } from "../../../../Shared/Enumes/statusCode"
import  { authMessages } from '../../../../Shared/constsnts/messages/authMessages'
import { IUnifiedGetMeUsecase } from "../../../../Application/common/interfaces/IUnifiedGetMeUsecase"
import { UnifiedGetMeInputDTO } from "../../../../Application/common/dtos/unified.getme.dto"
import { IUnifiedTokenRefreshUsecase } from "../../../../Application/common/interfaces/IUnifiedTokenRefreshUsecase"
import { env } from "../../../../Infrastructure/config/env"
import { IUnifiedLogoutUsecase } from "../../../../Application/common/interfaces/IUnifiedLogoutUsecase"
import { logger } from "../../../../utils/logging/loger"

export class UnifiedAuthController {
    constructor(
        private _unifiedGetMeUsecase: IUnifiedGetMeUsecase,
        private _unifiedRefreshTokenUsecase: IUnifiedTokenRefreshUsecase,
        private _unifiedLogoutUsecase: IUnifiedLogoutUsecase
    ) {}

    getMe = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            const role = req.user?.role

            if(!req.user){
                return res.status(statusCode.UNAUTHORIZED).json({
                    success: false,
                    message: authMessages.error.UNAUTHORIZED
                })
            }
            const payload: UnifiedGetMeInputDTO = {
                id: userId,
                role: role
            }

            const user = await this._unifiedGetMeUsecase.execute(payload)
            return res.status(statusCode.OK).json({
                success: true,
                user
            })
        } catch (error) {
            next(error)
        }
    }
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const parsed = refreshTokenSchema.parse(req.body)
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

            return res.status(statusCode.OK).json({
                success: true,
                message: authMessages.success.TOKEN_REFRESHED
            })


        } catch (error) {
            next(error)
        }
    }
logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const refreshToken = req.cookies.refreshToken
            await this._unifiedLogoutUsecase.execute(refreshToken)

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
            
        } catch (error) {
            next(error)
        }
    }
}