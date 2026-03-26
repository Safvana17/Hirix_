import { RegisterCompanyInputDTO, RegisterCompanyOutputDTO } from "../../dtos/auth/register.company.dto";

export interface ICompanyRegisterUsecase {
    execute(input: RegisterCompanyInputDTO): Promise<RegisterCompanyOutputDTO>
}