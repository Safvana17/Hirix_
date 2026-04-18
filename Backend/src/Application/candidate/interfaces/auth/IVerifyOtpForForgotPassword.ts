import { verifyCandidateForgotPasswordOtpInputDTO, verifyCandidateForgotPasswordOtpOutputDTO } from "../../dtos/auth/verifyOtpForForgotpassword.candidate.dto";

export interface ICandidateVerifyOtpForForgotPassswordUsecase {
    execute(request: verifyCandidateForgotPasswordOtpInputDTO): Promise<verifyCandidateForgotPasswordOtpOutputDTO>
}