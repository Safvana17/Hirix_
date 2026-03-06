import userRole from "../../../../Domain/enums/userRole.enum";
import { LoginCandidateOutputDTO } from "../../dtos/login.candidate.dto";

export interface IGoogleLoginUsecase {
    execute(token: string, role: userRole): Promise<LoginCandidateOutputDTO>
}