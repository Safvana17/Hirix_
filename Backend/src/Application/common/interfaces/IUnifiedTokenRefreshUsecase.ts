import { UnifiedRefreshTokenInputDTO, UnifiedRefreshTokenOutputDTO } from "../dtos/unified.refreshToken.dto";

export interface IUnifiedTokenRefreshUsecase{
    execute(request: UnifiedRefreshTokenInputDTO) : Promise<UnifiedRefreshTokenOutputDTO>
}