import { NextFunction, Request, Response } from "express";
import { IAdminLoginUsecase } from "../../../../Application/admin/interfaces/auth/IAdminLoginUsecase";
import { loginSchema } from "../../validators/loginValidator";
import { LoginAdminInputDto } from "../../../../Application/admin/dtos/auth/login.admin.dto";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { env } from "../../../../Infrastructure/config/env";


export class AdminAuthController {
    constructor(
        private _loginUsecase: IAdminLoginUsecase,
    ) {}

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = loginSchema.parse(req.body)
            const payload: LoginAdminInputDto = {
                email: parsed.email,
                password: parsed.password
            }

            const {refreshToken, accessToken, admin} = await this._loginUsecase.execute(payload)

            // const hashedToken = this.hashService.hashToken(refreshToken)
            // await this.adminRepository.updateToken(admin.id, hashedToken)

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
                admin,
                message: authMessages.success.ADMIN_LOGIN_SUCCESS
            })

        } catch (error) {
            next(error)
        }
    }

    // logout = async (req: Request, res: Response, next: NextFunction) => {
    //     try {

    //         const refreshToken = req.cookies?.refershToken
    //         await this._logoutUsecase.execute(refreshToken)
    //         res.clearCookie('refreshToken', {
    //             httpOnly: true,
    //             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    //             secure: process.env.NODE_ENV === 'production',
    //         })

    //         res.clearCookie('accessToken', {
    //             httpOnly: true,
    //             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    //             secure: process.env.NODE_ENV === 'production'
    //         })
    //         return res.status(statusCode.NO_CONTENT).json({
    //             success: true,
    //             message: authMessages.success.ADMIN_LOGOUT_SUCCESS
    //         })

    //     } catch (error) {
    //         next(error)
    //     }
    // }
    // refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const parsed = refreshTokenSchema.parse(req.body)
    //         const payload: AdminRefreshTokenInputDTO = {
    //             token: parsed.token
    //         }

    //         const tokens = this._refreshTokenUsecase.execute(payload)
        
    //         res.cookie('refreshToken', (await tokens).refreshToken, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === 'production',
    //             sameSite: process.env.NODE_ENV ==='production' ? 'none' : 'lax',
    //             maxAge: env.REFRESH_TOKEN_MAX_AGE,
    //             path: '/'
    //         })

    //         res.cookie('accessToken', (await tokens).accessToken, {
    //             httpOnly: true,
    //             secure: process.env.NODE_ENV === 'production',
    //             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    //             maxAge: env.ACCESS_TOKEN_MAX_AGE,
    //             path: '/'
    //         })

    //         return res.status(statusCode.OK).json({
    //             success: true,
    //             message: authMessages.success.TOKEN_REFRESHED
    //         })

    //     } catch (error) {
    //         next(error)
    //     }
    // }
}

