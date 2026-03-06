import { AccessTokenPayload, ITokenService, RefreshTokenPayload } from "../../Application/interface/service/ITokenService";
import { AppError } from "../../Domain/errors/app.error";
import { authMessages } from "../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../Shared/Enumes/statusCode";
import { jwtConfig } from "../config/jwt.config";
import jwt from 'jsonwebtoken'

export class TokenService implements ITokenService {
    generateRefreshToken(payload: RefreshTokenPayload): string {
        const refreshSecret = jwtConfig.refreshToken.secret
        if(!refreshSecret){
            throw new AppError(authMessages.error.REFRESH_TOKEN_SECRET_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return jwt.sign(payload,refreshSecret, {expiresIn: jwtConfig.refreshToken.expiresIn})
    }
/**
 * 
 * @param payload 
 * @returns 
 */
    generateAccessToken(payload: AccessTokenPayload): string {
        const accessSecret = jwtConfig.accessToken.secret
        if(!accessSecret){
            throw new AppError(authMessages.error.ACCESS_TOKEN_SECRET_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return jwt.sign(payload, accessSecret, {expiresIn: jwtConfig.accessToken.expiresIn})
    }

    verifyRefreshToken(token: string): RefreshTokenPayload {
        const refreshSecret = jwtConfig.refreshToken.secret
        if(!refreshSecret){
           throw new AppError(authMessages.error.REFRESH_TOKEN_SECRET_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return jwt.verify(token, refreshSecret)as RefreshTokenPayload
    }

    verifyAccessToken(token: string): AccessTokenPayload {
        const accessSecret = jwtConfig.accessToken.secret
        if(!accessSecret){
            throw new AppError(authMessages.error.ACCESS_TOKEN_SECRET_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return jwt.verify(token, accessSecret) as AccessTokenPayload
    }
}