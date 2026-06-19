import { Request, Response } from "express";
import { IAdminLoginUsecase } from "../../../../Application/admin/interfaces/auth/IAdminLoginUsecase";

import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { env } from "../../../../Infrastructure/config/env";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";


export class AdminAuthController {
    constructor(
        private _loginUsecase: IAdminLoginUsecase,
    ) {}

    login = asyncHandler ( async (req: Request, res: Response) => {
        const {refreshToken, accessToken, csrfToken, admin} = await this._loginUsecase.execute(req.body)    
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: env.REFRESH_TOKEN_MAX_AGE,
                path: '/'
            })

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: env.ACCESS_TOKEN_MAX_AGE,
                path: '/'
            })

            res.cookie("XSRF-TOKEN", csrfToken, {
                httpOnly: false,
                sameSite: "none",
                secure: true,
                path:"/",
            })            
        return sendSuccess(res, statusCode.OK, authMessages.success.ADMIN_LOGIN_SUCCESS, {admin, csrfToken})
    })
}

