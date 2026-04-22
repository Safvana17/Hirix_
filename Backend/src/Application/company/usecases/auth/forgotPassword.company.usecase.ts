import { NotificationEvents } from "../../../../Domain/enums/notification";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { CompanyForgotPasswordInputDTO, CompanyForgotPasswordOutputDTO } from "../../dtos/auth/forgotPassword.company.dto";
import { ICompanyForgotPasswordUsecase } from "../../interfaces/auth/ICompanyForgotPasswordUsecase";

export class CompanyForgotPasswordUsecase implements ICompanyForgotPasswordUsecase{
    constructor(
        private companyRepository: ICompanyRepository,
        private mailService: IMailService,
        private otpService: IOtpService,
        private otpStore: IOtpStore,
        private _processNotification: IAdminProcessNotificationUsecase
    ) {}

    async execute(request: CompanyForgotPasswordInputDTO): Promise<CompanyForgotPasswordOutputDTO> {
        const company = await this.companyRepository.findByEmail(request.email)

        if(!company || !company.id){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const id = company.id
        // const candidateId = id!;

        const otp = this.otpService.generate()
        const hashedOtp = await this.otpService.hash(otp)

        await this.otpStore.saveOtp(id, hashedOtp, 120)
        await this._processNotification.execute({
            event: NotificationEvents.RESET_PASSWORD_OTP_REQUESTED,
            recipients: [{
                recipientId: company.id,
                recipientType: company.getRole(),
                email: company.getEmail()
            }],
            variables: {
                userName: company.getName(),
                otpCode: otp,
                expiryTime: '120',
                platformName: 'Hirix'
            },
        })

        return {success: true}
    }
}