import { CompanyResetPasswordInputDTO, CompanyResetPasswordOutputDTO } from "../../dtos/resetPassword.company.dto";

export interface ICompanyResetPasswordUsecase{
    execute(request: CompanyResetPasswordInputDTO): Promise<CompanyResetPasswordOutputDTO>
}