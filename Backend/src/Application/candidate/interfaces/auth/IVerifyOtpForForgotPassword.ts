import { verifyCandidateForgotPasswordOtpInputDTO, verifyCandidateForgotPasswordOtpOutputDTO } from "../../dtos/verifyOtpForForgotpassword.candidate.dto";

export interface ICandidateVerifyOtpForForgotPassswordUsecase {
    execute(request: verifyCandidateForgotPasswordOtpInputDTO): Promise<verifyCandidateForgotPasswordOtpOutputDTO>
}