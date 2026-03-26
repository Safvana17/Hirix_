import { LoginCompanyInputDTO, LoginCompanyOutputDTO } from '../../dtos/auth/login.company.dto'

export interface ILoginCompanyUsecase{
    execute(request: LoginCompanyInputDTO): Promise<LoginCompanyOutputDTO>
}