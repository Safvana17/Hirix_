import AdminEntity from "../../../Domain/entities/admin.entity";
import CandidateEntity from "../../../Domain/entities/candidate.entity";
import CompanyEntity from "../../../Domain/entities/company.entity";
import userRole from "../../../Domain/enums/userRole.enum";
import { AppError } from "../../../Domain/errors/app.error";
import { IAuthRepository } from "../../../Domain/repositoryInterface/iAuth.repository";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { IHashService } from "../../interface/service/IHashService";
import { ITokenService } from "../../interface/service/ITokenService";
import { IUnifiedLogoutUsecase } from "../interfaces/IUnifiedLogoutUsecase";

export class UnifiedLogoutUsecase implements IUnifiedLogoutUsecase{
    constructor(
        private _repositoryRegistry: Map<userRole, IAuthRepository<CandidateEntity | CompanyEntity | AdminEntity>>,
        private _hashService: IHashService,
        private _tokenService: ITokenService
    ) {}
    async execute(refreshToken: string): Promise<void> {
        if(!refreshToken){
            throw new AppError(authMessages.error.REFRESH_TOKEN_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const payload = this._tokenService.verifyRefreshToken(refreshToken)
        const {id, role} = payload

        if(!id || !role) {
            throw new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }

        const repository = this._repositoryRegistry.get(role)
        if(!repository){
            throw new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }

        const user = await repository.findById(id)
        if(!user){
            throw new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }

        const hashedRefreshToken = await this._hashService.hash(refreshToken)
        await repository.revokeRefreshToken(hashedRefreshToken)
    }
}