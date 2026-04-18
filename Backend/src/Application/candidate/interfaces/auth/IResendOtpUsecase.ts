import { ResendOtpInputDTO, ResendOtpOutputDTO } from "../../dtos/auth/resendotp.candidate.dto";

export interface IResendOtpUsecase {
    execute(request: ResendOtpInputDTO): Promise<ResendOtpOutputDTO>
}