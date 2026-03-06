import { LoginCompanyInputDTO, LoginCompanyOutputDTO } from '../../dtos/login.company.dto'

export interface ILoginCompanyUsecase{
    execute(request: LoginCompanyInputDTO): Promise<LoginCompanyOutputDTO>
}