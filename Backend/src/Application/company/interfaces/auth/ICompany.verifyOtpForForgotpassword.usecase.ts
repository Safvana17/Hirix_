import { VerifyCompanyOtpForForgotPasswordInputDTO, VerifyCompanyOtpForForgotPasswordOutputDTO } from "../../dtos/auth/verifyOtpForForgotpassword.company.dto";

export interface ICompanyVerifyOtpForForgotPasswordUsease{
    execute(request: VerifyCompanyOtpForForgotPasswordInputDTO): Promise<VerifyCompanyOtpForForgotPasswordOutputDTO>
}