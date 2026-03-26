import { CompanyForgotPasswordInputDTO, CompanyForgotPasswordOutputDTO } from "../../dtos/auth/forgotPassword.company.dto";

export interface ICompanyForgotPasswordUsecase{
    execute(request: CompanyForgotPasswordInputDTO): Promise<CompanyForgotPasswordOutputDTO>
}