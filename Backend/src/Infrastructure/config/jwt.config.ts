import { env } from "./env";

export const jwtConfig = {
    accessToken: {
        secret: env.JWT_ACCESS_SECRET,
        expiresIn: env.ACCESS_TOKEN_TTL
    },
    refreshToken: {
        secret: env.JWT_REFRESH_SECRET,
        expiresIn: env.REFRESH_TOKEN_TTL
    },
    resetTokenForForgotPassword: {
        secret: env.RESET_TOKEN_SECRET,
        expiresIn: env.REFRESH_TOKEN_TTL
    }
}