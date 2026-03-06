import CandidateEntity from "../../../../Domain/entities/candidate.entity";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { IGoogleAuthService } from "../../../interface/service/IGoogleAuthService";
import { IHashService } from "../../../interface/service/IHashService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { LoginCandidateOutputDTO } from "../../dtos/login.candidate.dto";
import { IGoogleLoginUsecase } from "../../interfaces/auth/IGoogleLoginUsecase";

export class CandidateGoogleLoginUsecase implements IGoogleLoginUsecase{
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _tokenService: ITokenService,
        private _hashService: IHashService,
        private _googleAuthService: IGoogleAuthService
    ) {}

    async execute(token: string, role: userRole): Promise<LoginCandidateOutputDTO> {
        logger.info(`User role is: ${role}`)

        const googleCandidateInfo = await this._googleAuthService.getUserInfo(token)
        let candidate = await this._candidateRepository.findByEmail(googleCandidateInfo.email)

        if(!candidate){
            const newCandidate = new CandidateEntity(
                googleCandidateInfo.name,
                googleCandidateInfo.email,
                "",
                googleCandidateInfo.isVerified,
                undefined,
                googleCandidateInfo.googleId
            )

            candidate = await this._candidateRepository.create(newCandidate)
        }else{
            if(!candidate.getGoogleId()){
                candidate = await this._candidateRepository.updateGoogleId(googleCandidateInfo.email, googleCandidateInfo.googleId) || candidate
            }else if(candidate.getGoogleId() !== googleCandidateInfo.googleId){
                throw new AppError(authMessages.error.INVALID_GOOGLE_ID, statusCode.BAD_REQUEST)
            }
        }

        if(!candidate || !candidate.getId() || candidate.getRole()){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const id = candidate.getId()
        const candidateId = id!
        const refreshToken = this._tokenService.generateRefreshToken({id: candidateId, role: candidate.getRole()})
        const accessToken = this._tokenService.generateAccessToken({id: candidateId, email: candidate.getEmail(), role: candidate.getRole()})

        const hashedRefreshToken = this._hashService.hashToken(refreshToken)
        await this._candidateRepository.updateToken(candidateId, hashedRefreshToken)
        return {
           refreshToken,
           accessToken,
           candidate: {
            id: candidateId,
            email: candidate.getEmail(),
            name: candidate.getName(),
            role: candidate.getRole()
           }
        }
    }
}