import { RefreshTokenInputDTO, RefreshTokenOutputDTO } from "../../dtos/auth/RefreshTokenDTO"

export interface IRefreshTokenUsecase{
    execute(Request: RefreshTokenInputDTO): Promise<RefreshTokenOutputDTO>
}