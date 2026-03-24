import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { ITokenService } from "../../../interface/service/ITokenService";
import { verifyCandidateForgotPasswordOtpInputDTO, verifyCandidateForgotPasswordOtpOutputDTO } from "../../dtos/verifyOtpForForgotpassword.candidate.dto";
import { ICandidateVerifyOtpForForgotPassswordUsecase } from "../../interfaces/auth/IVerifyOtpForForgotPassword";

export class VerifyCandidateForgotPasswordOtpUsecase implements ICandidateVerifyOtpForForgotPassswordUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _otpService: IOtpService,
        private _otpStore: IOtpStore,
        private _tokenService: ITokenService
    ) {}

    async execute(request: verifyCandidateForgotPasswordOtpInputDTO): Promise<verifyCandidateForgotPasswordOtpOutputDTO> {
        const candidate = await this._candidateRepository.findByEmail(request.email)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const candidateId = candidate.getId()
        const storedOtp = await this._otpStore.getOtp(candidateId)
        if(!storedOtp){
            throw new AppError(authMessages.error.OTP_EXPIRED, statusCode.BAD_REQUEST)
        }

        const valid = await this._otpService.compare(request.otp, storedOtp)
        if(!valid){
            throw new AppError(authMessages.error.INVALID_OTP, statusCode.BAD_REQUEST)
        }

        const resetToken = this._tokenService.generateResetTokenForForgotPassword(candidate.getEmail())
        await this._otpStore.deleteOtp(candidateId)
        return {
            resetToken,
            email: candidate.getEmail()
        }
    }
}