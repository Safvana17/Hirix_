import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ResendOtpInputDTO, ResendOtpOutputDTO } from "../../dtos/resendotp.candidate.dto";
import { IResendOtpUsecase } from "../../interfaces/auth/IResendOtpUsecase";
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";

export class ResendOtpUsecase implements IResendOtpUsecase {
    constructor(
        private candidateRepository: ICandidateRepository,
        private otpService: IOtpService,
        private otpStore: IOtpStore,
        private mailService: IMailService
    ) {}

    async execute(request: ResendOtpInputDTO): Promise<ResendOtpOutputDTO> {
        const candidate = await this.candidateRepository.findByEmail(request.email)
        if(!candidate){
            throw new Error('Candidate not found')
        }

        const id = candidate.getId()
        const candidateId = id!

        const otp = this.otpService.generate()

        const hashedOtp = await this.otpService.hash(otp)

        await this.otpStore.saveOtp(candidateId, hashedOtp, 120)

        await this.mailService.sentOtp(request.email, hashedOtp)

        return {
            success: true
        }
    }
}