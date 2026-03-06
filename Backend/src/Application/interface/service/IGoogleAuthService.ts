import { GoogleAuthDTO } from "../../candidate/dtos/login.candidate.dto"

export interface IGoogleAuthService {
    getUserInfo(Token: string): Promise<GoogleAuthDTO>
}