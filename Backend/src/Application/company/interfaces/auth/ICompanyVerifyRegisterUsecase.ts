import { VerifyCompanyInputDTO, VerifyCompanyOutputDTO } from "../../dtos/auth/verifyRegister.company.dto";


export interface IVerifyRegisterCompanyUsecase {
    execute(request: VerifyCompanyInputDTO): Promise<VerifyCompanyOutputDTO>
}