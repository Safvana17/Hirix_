import { RefreshTokenInputDTO, RefreshTokenOutputDTO } from "../../dtos/RefreshTokenDTO"

export interface IRefreshTokenUsecase{
    execute(Request: RefreshTokenInputDTO): Promise<RefreshTokenOutputDTO>
}