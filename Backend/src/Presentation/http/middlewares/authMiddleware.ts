import { NextFunction, Request, Response } from "express";
import { AccessTokenPayload, ITokenService } from "../../../Application/interface/service/ITokenService";
import { AppError } from "../../../Domain/errors/app.error";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { TokenExpiredError } from "jsonwebtoken";

export function authHandler(tokenService: ITokenService) {
    return async (req: Request, res: Response, next: NextFunction) => {

        console.log("Auth middleware running");

        let token = req.cookies.accessToken 
        if(!token){
            return next(new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED))
        }

        try {
            const isBlackListed = await tokenService.isTokenBlackListed(token)
            if(isBlackListed){
               return next(new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED))
            }
            const user: AccessTokenPayload = tokenService.verifyAccessToken(token)
            req.user = user
            console.log("Decoded user:", user);
            next()

        } catch (error) {
            if(error instanceof TokenExpiredError){
                return next(new AppError(authMessages.error.ACCESS_TOKEN_EXPIRED, statusCode.UNAUTHORIZED))
            }else{
                return next(new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED))
            }
        }
    }
}