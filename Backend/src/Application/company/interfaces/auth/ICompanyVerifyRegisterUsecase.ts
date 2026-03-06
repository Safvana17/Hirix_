import { VerifyCompanyInputDTO, VerifyCompanyOutputDTO } from '../../dtos/verifyRegister.company.dto'

export interface IVerifyRegisterCompanyUsecase {
    execute(request: VerifyCompanyInputDTO): Promise<VerifyCompanyOutputDTO>
}