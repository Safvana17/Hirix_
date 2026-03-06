import { AppError } from "../../../../Domain/errors/app.error";
import IAdminRepository from "../../../../Domain/repositoryInterface/iAdmin.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IHashService } from "../../../interface/service/IHashService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { AdminRefreshTokenInputDTO, AdminRefreshTokenOutputDTO } from "../../dtos/auth/refreshToken.admin.dto";
import { IAdminRefreshTokenUsecase } from "../../interfaces/auth/IAdminRefreshTokenUsecase";

export class AdminRefreshTokenUsecase implements IAdminRefreshTokenUsecase{
    constructor(
        private _adminRepository: IAdminRepository,
        private _tokenService: ITokenService,
        private _hashService: IHashService
    ){}

    async execute(request: AdminRefreshTokenInputDTO): Promise<AdminRefreshTokenOutputDTO> {
        if(!request.token){
            throw new AppError(authMessages.error.REFRESH_TOKEN_NOT_FOUND, statusCode.UNAUTHORIZED)
        }

        const payload = this._tokenService.verifyRefreshToken(request.token)
        const adminId = payload.id

        if(!adminId){
            throw new AppError(authMessages.error.INVALID_REFRESH_TOKEN, statusCode.UNAUTHORIZED)
        }

        const admin = await this._adminRepository.findById(adminId)
        if(!admin){
            throw new AppError(authMessages.error.ADMIN_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const newAccessToken = this._tokenService.generateAccessToken({
            id: adminId,
            email: admin.getEmail(),
            role: admin.getRole()
        })

        const newRefereshToken = this._tokenService.generateRefreshToken({id: adminId, role: admin.getRole()})
        const hashedRefreshToken = this._hashService.hashToken(newRefereshToken)
        await this._adminRepository.updateToken(adminId, hashedRefreshToken)

        return {
            adminId,
            accessToken: newAccessToken,
            refreshToken: newRefereshToken
        }
    }
}