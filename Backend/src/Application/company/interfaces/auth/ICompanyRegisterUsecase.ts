import { RegisterCompanyInputDTO, RegisterCompanyOutputDTO } from "../../dtos/register.company.dto";

export interface ICompanyRegisterUsecase {
    execute(input: RegisterCompanyInputDTO): Promise<RegisterCompanyOutputDTO>
}