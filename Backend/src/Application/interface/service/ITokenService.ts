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


export interface ITokenService {
    generateAccessToken(payload: AccessTokenPayload): string
    generateRefreshToken(payload: RefreshTokenPayload): string
    generateCsrfToken(): string
    verifyAccessToken(token: string): AccessTokenPayload
    verifyRefreshToken(token: string): RefreshTokenPayload
}