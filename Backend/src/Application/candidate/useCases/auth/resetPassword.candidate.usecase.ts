import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ResetPasswordInputDTO, ResetPasswordOutputDTO } from "../../dtos/auth/resetpassword.candidate.dto";
import { IResetPasswordUsecase } from "../../interfaces/auth/IResetPasswordUsecase";
import { IHashService } from "../../../interface/service/IHashService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { ITokenService } from "../../../interface/service/ITokenService";
import { AppError } from "../../../../Domain/errors/app.error";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class ResetPasswordUsecase implements IResetPasswordUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _otpService: IOtpService,
        private _otpStore: IOtpStore,
        private _hashService: IHashService,
        private _tokenService: ITokenService
    ) {}

    /**
     * 
     * @param request old password and new password
     * @returns true if updated password
     */

    async execute(request: ResetPasswordInputDTO): Promise<ResetPasswordOutputDTO> {
        const candidate = await this._candidateRepository.findByEmail(request.email)
        if(!candidate || !candidate.getId()){
            throw new Error('Candidate not found')
        }

        const id = candidate.getId()
        const candidateId = id!;
        const valid = this._tokenService.verifyResetTokenForForgotPassword(request.resetToken)
        if(!valid){
            throw new AppError(authMessages.error.INVALID_RESET_TOKEN, statusCode.BAD_REQUEST)
        }

        const changedPassword = await this._hashService.hash(request.newPassword)
        await this._candidateRepository.updatePassword(candidateId,changedPassword)
        // await this.candidateRepository.save(candidate)

        return {success: true}
    }
}