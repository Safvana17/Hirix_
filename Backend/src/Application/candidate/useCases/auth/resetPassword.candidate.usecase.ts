import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ResetPasswordInputDTO, ResetPasswordOutputDTO } from "../../dtos/resetpassword.candidate.dto";
import { IResetPasswordUsecase } from "../../interfaces/auth/IResetPasswordUsecase";
import { IHashService } from "../../../interface/service/IHashService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";

export class ResetPasswordUsecase implements IResetPasswordUsecase {
    constructor(
        private candidateRepository: ICandidateRepository,
        private otpService: IOtpService,
        private otpStore: IOtpStore,
        private hashService: IHashService
    ) {}

    async execute(request: ResetPasswordInputDTO): Promise<ResetPasswordOutputDTO> {
        const candidate = await this.candidateRepository.findByEmail(request.email)
        if(!candidate || !candidate.getId()){
            throw new Error('Candidate not found')
        }

        const id = candidate.getId()
        const candidateId = id!;
        const hashedOtp = await this.otpStore.getOtp(candidateId)
        const isValid = await this.otpService.compare(request.otp, hashedOtp!)
        if(!isValid){
            throw new Error('Invalid OTP')
        }

        const changedPassword = await this.hashService.hash(request.newPassword)
        await this.candidateRepository.updatePassword(candidateId,changedPassword)
        // await this.candidateRepository.save(candidate)

        await this.otpStore.deleteOtp(candidateId)

        return {success: true}
    }
}