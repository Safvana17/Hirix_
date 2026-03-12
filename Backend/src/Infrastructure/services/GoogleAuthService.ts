import { GoogleAuthDTO } from "../../Application/candidate/dtos/login.candidate.dto";
import { IGoogleAuthService } from "../../Application/interface/service/IGoogleAuthService";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";
import { AppError } from "../../Domain/errors/app.error";
import { authMessages } from "../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../Shared/Enumes/statusCode";
import { logger } from "../../utils/logging/loger";

export class GoogleAuthService implements IGoogleAuthService{

    private client: OAuth2Client
    
    constructor(){
        this.client = new OAuth2Client(env.GOOGLE_CLIENT_ID)
    }

    async getUserInfo(Token: string): Promise<GoogleAuthDTO> {
        try {
            const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${Token}`
                }
            })

            const payload = await response.json()

            if(!payload || !payload.email){
                throw new AppError(authMessages.error.INVALID_GOOGLE_TOKEN_PAYLOAD, statusCode.UNAUTHORIZED)
            }

            return {
                isVerified: payload.email_verified || false,
                googleId: payload.sub,
                email: payload.email,
                name: payload.name || 'unknown user'
            }
        } catch (error) {
            logger.error(`failed to verify google token: ${error}`)
            throw new AppError(authMessages.error.GOOGLE_TOKEN_VERIFICATION_FAILURE, statusCode.UNAUTHORIZED)
        }
    }
}