import { VerifyCompanyOtpForForgotPasswordInputDTO, VerifyCompanyOtpForForgotPasswordOutputDTO } from "../../dtos/verifyOtpForForgotpassword.company.dto";

export interface ICompanyVerifyOtpForForgotPasswordUsease{
    execute(request: VerifyCompanyOtpForForgotPasswordInputDTO): Promise<VerifyCompanyOtpForForgotPasswordOutputDTO>
}