import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { RefreshTokenInputDTO, RefreshTokenOutputDTO } from "../../dtos/RefreshTokenDTO";
import { IRefreshTokenUsecase } from "../../interfaces/auth/IRefreshTokenUsecase";
import { ITokenService } from "../../../interface/service/ITokenService";
import { IHashService } from "../../../interface/service/IHashService";

export class RefreshTokenUsecase implements IRefreshTokenUsecase {
    constructor(
        private _tokenService: ITokenService,
        private _candidateRepository: ICandidateRepository,
        private _hashService: IHashService
    ) {}

    /**
     * 
     * @param Request - request for generating new access token
     * @returns - returning new access token and refresh token
     */
    async execute(Request: RefreshTokenInputDTO): Promise<RefreshTokenOutputDTO> {
        if(!Request.token){
            throw new AppError(authMessages.error.REFRESH_TOKEN_NOT_FOUND, statusCode.UNAUTHORIZED)
        }

        const payload = this._tokenService.verifyRefreshToken(Request.token)
        const candidateId = payload.id

        if(!candidateId){
            throw new AppError(authMessages.error.INVALID_REFRESH_TOKEN, statusCode.UNAUTHORIZED)
        }

        const candidate = await this._candidateRepository.findById(candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const newAccessToken = this._tokenService.generateAccessToken({
            id: candidateId,
            email: candidate.getEmail(),
            role: candidate.getRole()
        })

        const newRefereshToken = this._tokenService.generateRefreshToken({id: candidateId, role: candidate.getRole()})
        const hashedRefreshToken = this._hashService.hashToken(newRefereshToken)
        await this._candidateRepository.updateToken(candidateId, hashedRefreshToken)

        return {
            candidateId,
            accessToken: newAccessToken,
            refreshToken: newRefereshToken
        }
    }
}