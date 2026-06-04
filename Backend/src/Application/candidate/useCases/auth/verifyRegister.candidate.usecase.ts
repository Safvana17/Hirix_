import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { verifyRegisterCandidateOtpInputDTO, verifyRegisterCandidateOtpOutputDTO } from "../../dtos/auth/verifyRegister.candidate.dto";
import { IVerifyRegisterCandidate } from "../../interfaces/auth/IVerifyRegisterCandidate";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { ITokenService } from "../../../interface/service/ITokenService";
import { AppError } from "../../../../Domain/errors/app.error";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { IActivityLogRepository } from "../../../../Domain/repositoryInterface/IActivityLog.repository";
import userRole from "../../../../Domain/enums/userRole.enum";
import { ActivityAction } from "../../../../Domain/enums/activityLog";

export class VerifyRegisterCandidateOtpUsecase implements IVerifyRegisterCandidate{
    constructor(
        private candidateRepository: ICandidateRepository,
        private otpStore: IOtpStore,
        private otpService: IOtpService,
        private tokenService: ITokenService,
        private _activityLogRepository: IActivityLogRepository
    ) {}

    /**
     * 
     * @param request 
     * @returns 
     */
    async execute(request: verifyRegisterCandidateOtpInputDTO): Promise<verifyRegisterCandidateOtpOutputDTO> {

        const candidate = await this.candidateRepository.findByEmail(request.email)
        if(!candidate || !candidate.getId()){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(candidate.isUserVerified()){
            throw new AppError(authMessages.error.ALREADY_VERIFIED, statusCode.BAD_REQUEST)
        }

        const Id = candidate.getId()
        const candidateId = Id!;
        const storedOtp = await this.otpStore.getOtp(candidateId)
        if(!storedOtp){
            throw new AppError(authMessages.error.OTP_EXPIRED, statusCode.BAD_REQUEST)
        }

        const isValid = await this.otpService.compare(request.otp, storedOtp)

        if(!isValid){
            throw new AppError(authMessages.error.INVALID_OTP, statusCode.BAD_REQUEST)
        }

        candidate.markAsVerified()
        candidate.setStatus(UserStatus.ACTIVE)
        
        await this.candidateRepository.update(candidateId, candidate)
        await this.otpStore.deleteOtp(candidateId)

        await this._activityLogRepository.create({
            id: '',
            actorId: candidate.id,
            actorType: userRole.Candidate,
            action: ActivityAction.CANDIDATE_REGISTERED,
            targetId: candidate.id,
            targetType: 'Candidate',
            title: `${candidate.getName()} was joined Hirix `
        })
        // const refreshToken = this.tokenService.generateRefreshToken({candidateId})
        // const accessToken = this.tokenService.generateAccessToken({candidateId, email: candidate.getEmail(), role: candidate.getRole()})

        return {
            candidate: {
                id: candidateId,
                name: candidate.getName(),
                email: candidate.getEmail(),
                role: candidate.getRole()

            }
        }
    }
}