import { RegisterCandidateInputDTO, RegisterCandidateOutputDTO } from "../../dtos/register.candidate.dto";

export interface ICandidateRegisterUsecase {
    execute(input: RegisterCandidateInputDTO): Promise<RegisterCandidateOutputDTO>
}