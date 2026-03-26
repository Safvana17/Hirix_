import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IHashService } from "../../../interface/service/IHashService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { CompanyRefreshTokenInputDTO, CompanyRefreshTokenOutputDTO } from "../../dtos/auth/CompanyRefreshTokenDTO";
import { ICompanyRefreshTokenUsecase } from "../../interfaces/auth/ICompanyRefreshTokenUsecase";

export class CompanyRefreshTokenUsecase implements ICompanyRefreshTokenUsecase{
    constructor(
        private _companyRepository: ICompanyRepository,
        private _tokenService: ITokenService,
        private _hashService: IHashService
    ) {}

    async execute(request: CompanyRefreshTokenInputDTO): Promise<CompanyRefreshTokenOutputDTO> {
        if(!request.token){
            throw new AppError(authMessages.error.REFRESH_TOKEN_NOT_FOUND, statusCode.UNAUTHORIZED)
        }

        const payload = this._tokenService.verifyRefreshToken(request.token)
        const companyId = payload.id

        if(!companyId){
            throw new AppError(authMessages.error.INVALID_REFRESH_TOKEN, statusCode.UNAUTHORIZED)
        }

        const company = await this._companyRepository.findById(companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const newAccessToken = this._tokenService.generateAccessToken({
            id: companyId,
            email: company.getEmail(),
            role: company.getRole()
        })

        const newRefereshToken = this._tokenService.generateRefreshToken({id: companyId, role: company.getRole()})
        const hashedRefreshToken = this._hashService.hashToken(newRefereshToken)
        await this._companyRepository.updateToken(companyId, hashedRefreshToken)

        return {
            companyId,
            accessToken: newAccessToken,
            refreshToken: newRefereshToken
        }
    }
}