import { verifyRegisterCandidateOtpInputDTO, verifyRegisterCandidateOtpOutputDTO } from "../../dtos/auth/verifyRegister.candidate.dto";

export interface IVerifyRegisterCandidate {
    execute(request: verifyRegisterCandidateOtpInputDTO): Promise<verifyRegisterCandidateOtpOutputDTO>
}