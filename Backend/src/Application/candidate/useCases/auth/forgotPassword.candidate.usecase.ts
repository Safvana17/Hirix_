import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ForgotPasswordInputDTO, ForgotPasswordOutputDTO } from "../../dtos/forgotpassword.candidate.dto";
import { IForgotPasswordUsecase } from "../../interfaces/auth/IForgotPasswordUsecase";
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { AppError } from "../../../../Domain/errors/app.error";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";


export class ForgotPasswordUsecase implements IForgotPasswordUsecase{
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _otpService: IOtpService,
        private _otpStore: IOtpStore,
        private _mailService: IMailService
    ) {}

    async execute(request: ForgotPasswordInputDTO): Promise<ForgotPasswordOutputDTO> {
        
        const candidate = await this._candidateRepository.findByEmail(request.email)

        if(!candidate || !candidate.getId()){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        console.log('from forgot usecase')
        const id = candidate.getId()
        const candidateId = id!;

        const otp = this._otpService.generate()
        logger.info({otp: otp})
        logger.info(`your otp is: ${otp}`)
        const hashedOtp = await this._otpService.hash(otp)

        await this._otpStore.saveOtp(candidateId, hashedOtp, 120)
        await this._mailService.sentOtp(candidate.getEmail(), otp)

        return {success: true}
    }
}