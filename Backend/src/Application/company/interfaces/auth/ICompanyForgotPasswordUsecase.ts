import { CompanyForgotPasswordInputDTO, CompanyForgotPasswordOutputDTO } from "../../dtos/forgotPassword.company.dto";

export interface ICompanyForgotPasswordUsecase{
    execute(request: CompanyForgotPasswordInputDTO): Promise<CompanyForgotPasswordOutputDTO>
}