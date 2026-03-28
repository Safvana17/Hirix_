import { CompanyChangePasswordInputDTO, CompanyChangePasswordOutputDTO } from "../../dtos/settings/changePassword.company.dto";


export interface ICompanyChangePasswordUsecase {
    execute(request: CompanyChangePasswordInputDTO): Promise<CompanyChangePasswordOutputDTO>
}