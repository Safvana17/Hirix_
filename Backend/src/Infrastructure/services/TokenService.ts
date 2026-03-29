import crypto from 'crypto'
import { AccessTokenPayload, ITokenService, RefreshTokenPayload, ResetTokenPayload } from "../../Application/interface/service/ITokenService";
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

    generateCsrfToken(): string {
        return crypto.randomBytes(32).toString("hex")
    }

    generateResetTokenForForgotPassword(email: string): string {
        const resetTokenSecret = jwtConfig.resetTokenForForgotPassword.secret
        return jwt.sign({
            email,
            purpose: 'password-reset'
        },
        resetTokenSecret,
        {
           expiresIn: jwtConfig.resetTokenForForgotPassword.expiresIn
        })
    }

    generateRestoreAccountToken(email: string): string {
        const resetTokenSecret = jwtConfig.restoreAccountToken.secret
        return jwt.sign({
            email,
            purpose: 'restore-account'
        },
        resetTokenSecret,
        {
           expiresIn: jwtConfig.restoreAccountToken.expiresIn
        })
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
    verifyResetTokenForForgotPassword(token: string): ResetTokenPayload {
        const resetTokenSecret = jwtConfig.resetTokenForForgotPassword.secret
        const decoded =  jwt.verify(token, resetTokenSecret) as ResetTokenPayload
        if(decoded.purpose !== 'password-reset'){
            throw new AppError(authMessages.error.INVALID_TOKEN_PURPOSE, statusCode.BAD_REQUEST)
        }

        return {email: decoded.email, purpose: decoded.purpose}
    }
}