import { LoginCandidateInputDTO, LoginCandidateOutputDTO } from "../../dtos/login.candidate.dto";

export interface ICandidateLoginUsecase {
    execute(input: LoginCandidateInputDTO): Promise<LoginCandidateOutputDTO>
}