import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { LoginCandidateInputDTO, LoginCandidateOutputDTO } from "../../dtos/login.candidate.dto";
import { IHashService } from "../../../interface/service/IHashService";
import { ITokenService } from "../../../interface/service/ITokenService";

export class LoginCandidateUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _tokenService: ITokenService,
        private _hashService: IHashService
    ) {}

    /**
     * 
     * @param request - login credentials (email, password)
     * @returns - Authentication result with tokens and user info
     */
    async execute(request: LoginCandidateInputDTO): Promise<LoginCandidateOutputDTO> {

        const candidate = await this._candidateRepository.findByEmail(request.email)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(candidate.getIsBlocked()){
            throw new AppError(authMessages.error.CANDIDATE_BLOCKED, statusCode.FORBIDDEN)
        }

        const isValidPassword = await this._hashService.compare(request.password, candidate.getPassword())
        if(!isValidPassword){
            throw new AppError(authMessages.error.INVALID_PASSWORD, statusCode.UNAUTHORIZED)
        }

        const id = candidate.getId()
        const candidateId = id!;
        if(!id){
            throw new AppError(authMessages.error.CANDIDATE_ID_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const refreshToken = this._tokenService.generateRefreshToken({id: candidateId, role: candidate.getRole()})
        const accessToken = this._tokenService.generateAccessToken({id: candidateId, email: candidate.getEmail(), role: candidate.getRole()})
        const csrfToken = this._tokenService.generateCsrfToken()

        const hashedRefreshToken = this._hashService.hashToken(refreshToken)
        await this._candidateRepository.updateToken(candidateId, hashedRefreshToken)


        return {refreshToken, accessToken, csrfToken, candidate: {
            id: candidateId,
            email: candidate.getEmail(),
            name: candidate.getName(),
            role: candidate.getRole()
        }}

    }
}