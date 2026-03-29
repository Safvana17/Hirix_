import userRole from "../../../Domain/enums/userRole.enum";

export interface AccessTokenPayload { 
    id: string;
    email: string;
    role: userRole
}

export interface RefreshTokenPayload {
    id: string;
    role: userRole
}

export interface ResetTokenPayload {
    email: string
    purpose: string
}

export interface RestoreAccountTokenPayload {
    email: string
    purpose: string
}


export interface ITokenService {
    generateAccessToken(payload: AccessTokenPayload): string
    generateRefreshToken(payload: RefreshTokenPayload): string
    generateCsrfToken(): string
    generateResetTokenForForgotPassword(email: string): string
    generateRestoreAccountToken(email: string): string
    verifyAccessToken(token: string): AccessTokenPayload
    verifyRefreshToken(token: string): RefreshTokenPayload
    verifyResetTokenForForgotPassword(token: string): ResetTokenPayload
    verifyRestoreAccountToken(token: string): RestoreAccountTokenPayload

}