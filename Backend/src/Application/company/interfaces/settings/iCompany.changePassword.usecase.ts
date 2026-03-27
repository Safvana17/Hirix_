import { CompanyChangePasswordOutputDTO } from "../../dtos/settings/changePassword.company.dto";
import { CompanyChangePasswordInputDTO } from "../../dtos/settings/settings.company.dto";

export interface ICompanyChangePasswordUsecase {
    execute(request: CompanyChangePasswordInputDTO): Promise<CompanyChangePasswordOutputDTO>
}