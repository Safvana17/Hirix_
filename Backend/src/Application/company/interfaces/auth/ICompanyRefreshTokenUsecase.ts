import { CompanyRefreshTokenInputDTO, CompanyRefreshTokenOutputDTO } from "../../dtos/auth/CompanyRefreshTokenDTO";

export interface ICompanyRefreshTokenUsecase{
    execute(request: CompanyRefreshTokenInputDTO): Promise<CompanyRefreshTokenOutputDTO>
}