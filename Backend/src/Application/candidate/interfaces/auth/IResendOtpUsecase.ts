import { ResendOtpInputDTO, ResendOtpOutputDTO } from "../../dtos/resendotp.candidate.dto";

export interface IResendOtpUsecase {
    execute(request: ResendOtpInputDTO): Promise<ResendOtpOutputDTO>
}