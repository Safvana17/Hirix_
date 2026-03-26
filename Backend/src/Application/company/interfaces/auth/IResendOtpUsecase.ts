import { ResendOtpCompanyInputDTO, ResendOtpCompanyOutputDTO } from "../../dtos/auth/resendOtp.company.dto";

export interface IResendOtpCompanyUsecase {
    execute(request: ResendOtpCompanyInputDTO): Promise<ResendOtpCompanyOutputDTO>
}