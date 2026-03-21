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

            const {refreshToken, accessToken, csrfToken, admin} = await this._loginUsecase.execute(payload)

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

            res.cookie("XSRF-TOKEN", csrfToken, {
                httpOnly: false,
                secure: true,
                sameSite: "lax"
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
}

