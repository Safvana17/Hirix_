import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ForgotPasswordInputDTO, ForgotPasswordOutputDTO } from "../../dtos/auth/forgotpassword.candidate.dto";
import { IForgotPasswordUsecase } from "../../interfaces/auth/IForgotPasswordUsecase";
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { AppError } from "../../../../Domain/errors/app.error";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { NotificationEvents } from "../../../../Domain/enums/notification";


export class ForgotPasswordUsecase implements IForgotPasswordUsecase{
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _otpService: IOtpService,
        private _otpStore: IOtpStore,
        private _mailService: IMailService,
        private _processNotificationUsecase: IAdminProcessNotificationUsecase
    ) {}

    /**
     * 
     * @param request - user email
     * @returns - true if it send otp
     */

    async execute(request: ForgotPasswordInputDTO): Promise<ForgotPasswordOutputDTO> {
        
        const candidate = await this._candidateRepository.findByEmail(request.email)

        if(!candidate || !candidate.getId()){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        console.log('from forgot usecase')
        const id = candidate.getId()
        const candidateId = id!;

        const otp = this._otpService.generate()
        logger.info({OTP: otp}, 'Your forgot password otp')
        const hashedOtp = await this._otpService.hash(otp)

        await this._otpStore.saveOtp(candidateId, hashedOtp, 120)
        await this._processNotificationUsecase.execute({
            event: NotificationEvents.RESET_PASSWORD_OTP_REQUESTED,
            recipients: [{
                recipientId: candidate.id,
                recipientType: candidate.getRole(),
                email: candidate.getEmail()
            }],
            variables: {
                userName: candidate.getName(),
                otpCode: otp,
                expiryTime: '120',
                platformName: 'Hirix'
            },
            metaData: {
                candidateId: candidate.id
            }
        })

        return {success: true}
    }
}