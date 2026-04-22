import { NotificationEvents } from "../../../../Domain/enums/notification";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { IHashService } from "../../../interface/service/IHashService";
import { IMailService } from "../../../interface/service/IMailService";
import { DeleteAccountInputDTO, DeleteAccountOutputDTO } from "../../dtos/settings/deleteAccount.company.dto";
import { IDeleteAccountUsecase } from "../../interfaces/settings/iCompany.deleteAccount.usecase";

export class DeleteAccountUsecase implements IDeleteAccountUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _hashService: IHashService,
        private _mailService: IMailService,
        private _processNotification: IAdminProcessNotificationUsecase
    ) {}

    async execute(request: DeleteAccountInputDTO): Promise<DeleteAccountOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(!request.reason){
            throw new AppError(settingsMessages.error.DELETE_REASON_REQUIRED, statusCode.BAD_REQUEST)
        }

        const isMatch = await this._hashService.compare(request.password, company.getPassword())
        if(!isMatch){
            throw new AppError(settingsMessages.error.INCORRECT_PASSWORD, statusCode.BAD_REQUEST)
        }

        company.isDeleted = true
        company.deletedAt = new Date()
        company.deleteReason = request.reason
        company.deleteFeedback = request.feedback
        await this._companyRepository.update(company.id, company)
        await this._processNotification.execute({
            event: NotificationEvents.ACCOUNT_DELETED,
            recipients: [{
                recipientId: company.id,
                recipientType: company.getRole(),
                email: company.getEmail()
            }],
            variables: {
                companyName: company.getName(),
                platformName: "Hirix",
                reason: request.reason,
                frontendUrl: 'http://localhost:5173/login'
            }
        })

        return { success: true}
    }
}