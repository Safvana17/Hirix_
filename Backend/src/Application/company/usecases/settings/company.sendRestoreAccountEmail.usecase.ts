import { NotificationEvents } from "../../../../Domain/enums/notification";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { env } from "../../../../Infrastructure/config/env";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { IMailService } from "../../../interface/service/IMailService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { SendRestoreAccountEmailInputDTO, SendRestoreAccountEmailOutputDTO } from "../../dtos/settings/deleteAccount.company.dto";
import { ISendRestoreAccountEmailUsecase } from "../../interfaces/settings/iCompany.sendRestoreAccountEmail.usecase";

export class SendRestoreAccountEmailUsecase implements ISendRestoreAccountEmailUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _mailService: IMailService,
        private _tokenService: ITokenService,
        private _processNotification: IAdminProcessNotificationUsecase
    ) {}

    async execute(request: SendRestoreAccountEmailInputDTO): Promise<SendRestoreAccountEmailOutputDTO> {
        if(request.role !== userRole.Company){
            throw new AppError(settingsMessages.error.NOT_COMPANY, statusCode.BAD_REQUEST)
        }

        const company = await this._companyRepository.findByEmail(request.email)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const restoreToken = await this._tokenService.generateRestoreAccountToken(company.getEmail())
        const restoreAccountLink = `${env.FRONTEND_URL}/company/restore-account?token=${restoreToken}`
        logger.info({link: restoreAccountLink}, 'Restore account link')

        await this._processNotification.execute({
            event: NotificationEvents.ACCOUNT_RESTORE,
            recipients: [{
                recipientId: company.id,
                recipientType: company.getRole(),
                email: company.getEmail()
            }],
            variables: {
                companyName: company.getName(),
                platformName: "Hirix",
                frontendUrl: restoreAccountLink
            }
        })

        return { success: true}
    }
}