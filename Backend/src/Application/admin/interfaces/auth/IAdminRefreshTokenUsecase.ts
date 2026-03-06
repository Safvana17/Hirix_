import { AdminRefreshTokenInputDTO, AdminRefreshTokenOutputDTO } from "../../dtos/auth/refreshToken.admin.dto";


export interface IAdminRefreshTokenUsecase{
    execute(request: AdminRefreshTokenInputDTO): Promise<AdminRefreshTokenOutputDTO>
}