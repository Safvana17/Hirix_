import { NotificationEvents } from "../../../../Domain/enums/notification";
import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { env } from "../../../../Infrastructure/config/env";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IMailService } from "../../../interface/service/IMailService";
import { AdminRejectCompanyInputDTO, UpdateStatusOutputDTO } from "../../dtos/userManagement/updateStatus.admin.dto";
import { IAdminProcessNotificationUsecase } from "../../interfaces/settings/IAdmin.processNotification.usecase";
import { IAdminRejectCompanyUsecase } from "../../interfaces/userManagement/iAdmin.rejectCompany.usecase";

export class AdminRejectCompanyUsecase implements IAdminRejectCompanyUsecase{
    constructor(
        private _companyRepository: ICompanyRepository,
        private _mailService: IMailService,
        private _processNotification: IAdminProcessNotificationUsecase
    ) {}


    /**
     * 
     * @param request - company id and reject company register flag
     * @returns company id, role and status
     */
    async execute(request: AdminRejectCompanyInputDTO): Promise<UpdateStatusOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        company.setStatus(UserStatus.REJECTED)
        company.setIsAdminVerified(false)
        await this._companyRepository.update(request.id, company)

        const loginLink = `${env.FRONTEND_URL}/login`

        await this._processNotification.execute({
            event: NotificationEvents.COMPANY_REJECTED,
            recipients: [{
                recipientId: company.id,
                recipientType: company.getRole(),
                email: company.getEmail()
            }],
            variables: {
                companyName: company.getName(),
                platformName: "Hirix",
                reason: request.reason,
                platformUrl: loginLink
            }
        })

        return {
            id: company.getId(),
            status: company.getStatus(),
            role: company.getRole()
        }
    }
}