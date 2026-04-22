import { NotificationEvents } from "../../../../Domain/enums/notification";
import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IMailService } from "../../../interface/service/IMailService";
import { AdminApproveCompanyInputDTO, UpdateStatusOutputDTO } from '../../dtos/userManagement/updateStatus.admin.dto'
import { IAdminProcessNotificationUsecase } from "../../interfaces/settings/IAdmin.processNotification.usecase";
import { IAdminApproveCompanyUsecase } from "../../interfaces/userManagement/iAdmin.approveCompany.usecase";


export class AdminApproveCompanyUsecase implements IAdminApproveCompanyUsecase {
    constructor(
         private _companyRepository: ICompanyRepository,
         private _mailService: IMailService,
         private _processNotification: IAdminProcessNotificationUsecase
    ) {}

    /**
     * 
     * @param request - company id and approve flag for approving company register
     * @returns - company id, role and status
     */
    async execute(request: AdminApproveCompanyInputDTO): Promise<UpdateStatusOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        company.setStatus(UserStatus.ACTIVE)
        company.setIsAdminVerified(true)
        await this._companyRepository.update(request.id, company)
        await this._processNotification.execute({
            event: NotificationEvents.COMPANY_APPROVED,
            recipients: [{
                recipientId: company.id,
                recipientType: company.getRole(),
                email: company.getEmail()
            }],
            variables: {
                companyName: company.getName(),
                platformName: "Hirix",
                frontendURL: 'http://localhost:5173/login'
            }
        })
        return {
            id: company.getId(),
            role: company.getRole(),
            status: company.getStatus()
        }
    }
}