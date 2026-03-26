import { CompanyResetPasswordInputDTO, CompanyResetPasswordOutputDTO } from "../../dtos/auth/resetPassword.company.dto";

export interface ICompanyResetPasswordUsecase{
    execute(request: CompanyResetPasswordInputDTO): Promise<CompanyResetPasswordOutputDTO>
}