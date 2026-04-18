import { GoogleAuthDTO } from "../../candidate/dtos/auth/login.candidate.dto"

export interface IGoogleAuthService {
    getUserInfo(Token: string): Promise<GoogleAuthDTO>
}