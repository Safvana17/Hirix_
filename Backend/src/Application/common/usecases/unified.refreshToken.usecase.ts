import AdminEntity from "../../../Domain/entities/admin.entity";
import CandidateEntity from "../../../Domain/entities/candidate.entity";
import CompanyEntity from "../../../Domain/entities/company.entity";
import userRole from "../../../Domain/enums/userRole.enum";
import { AppError } from "../../../Domain/errors/app.error";
import { IBaseRepository } from "../../../Domain/repositoryInterface/iBase.repository";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { logger } from "../../../utils/logging/loger";
import { IHashService } from "../../interface/service/IHashService";
import { ITokenService } from "../../interface/service/ITokenService";
import { UnifiedRefreshTokenInputDTO, UnifiedRefreshTokenOutputDTO } from "../dtos/unified.refreshToken.dto";
import { IUnifiedTokenRefreshUsecase } from "../interfaces/IUnifiedTokenRefreshUsecase";

export class UnifiedRefreshTokenUsecase implements IUnifiedTokenRefreshUsecase{
    constructor(
        private _repositoryRegistry: Map<userRole, IBaseRepository<CandidateEntity | CompanyEntity | AdminEntity>>,
        private _tokenService: ITokenService,
        private _hashService: IHashService
    ) {}

    async execute(request: UnifiedRefreshTokenInputDTO): Promise<UnifiedRefreshTokenOutputDTO> {
        if(!request.token){
            throw new AppError(authMessages.error.REFRESH_TOKEN_NOT_FOUND, statusCode.UNAUTHORIZED)
        }
        // logger.info(`from usecase token is: ${request.token}`)

        const payload = this._tokenService.verifyRefreshToken(request.token)
        const {id, role} = payload
        logger.info(`role: ${role}, id: ${id}`)

        if(!id || !role){
            throw new AppError(authMessages.error.INVALID_REFRESH_TOKEN, statusCode.UNAUTHORIZED)
        }

        const repository = this._repositoryRegistry.get(role)
        if(!repository){
            throw new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }

        const user = await repository.findById(id)
        if(!user){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const newAccessToken = this._tokenService.generateAccessToken({
            id: user.id!,
            email: user.getEmail(),
            role: user.getRole()
        })

        const newRefereshToken = this._tokenService.generateRefreshToken({id: user.id!, role: user.getRole()})
        const hashedRefreshToken = await this._hashService.hashToken(newRefereshToken)
        await repository.updateToken(user.id!, hashedRefreshToken)

        return {
            userId: user.id!,
            accessToken: newAccessToken,
            refreshToken: newRefereshToken
        }
    }
}
