import { RegisterCandidateInputDTO, RegisterCandidateOutputDTO } from "../../dtos/auth/register.candidate.dto";

export interface ICandidateRegisterUsecase {
    execute(input: RegisterCandidateInputDTO): Promise<RegisterCandidateOutputDTO>
}