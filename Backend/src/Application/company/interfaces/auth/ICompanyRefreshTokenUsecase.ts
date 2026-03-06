import { CompanyRefreshTokenInputDTO, CompanyRefreshTokenOutputDTO } from "../../dtos/CompanyRefreshTokenDTO";

export interface ICompanyRefreshTokenUsecase{
    execute(request: CompanyRefreshTokenInputDTO): Promise<CompanyRefreshTokenOutputDTO>
}