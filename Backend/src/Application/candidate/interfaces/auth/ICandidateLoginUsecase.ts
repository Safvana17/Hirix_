import { LoginCandidateInputDTO, LoginCandidateOutputDTO } from "../../dtos/auth/login.candidate.dto";

export interface ICandidateLoginUsecase {
    execute(input: LoginCandidateInputDTO): Promise<LoginCandidateOutputDTO>
}