import { verifyRegisterCompanyOtpInputDTO, verifyRegisterCompanyOtpOutputDTO } from "../../dtos/auth/company.verifyRegisterotp.dto";

export interface IVerifyRegisterCompanyOtpUsecase {
    execute(request: verifyRegisterCompanyOtpInputDTO): Promise<verifyRegisterCompanyOtpOutputDTO>
}