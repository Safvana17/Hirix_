import { ResendOtpCompanyInputDTO, ResendOtpCompanyOutputDTO } from "../../dtos/resendOtp.company.dto";

export interface IResendOtpCompanyUsecase {
    execute(request: ResendOtpCompanyInputDTO): Promise<ResendOtpCompanyOutputDTO>
}