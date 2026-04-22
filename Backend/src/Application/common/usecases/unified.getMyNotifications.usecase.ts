import AdminEntity from "../../../Domain/entities/admin.entity";
import CandidateEntity from "../../../Domain/entities/candidate.entity";
import CompanyEntity from "../../../Domain/entities/company.entity";
import userRole from "../../../Domain/enums/userRole.enum";
import { AppError } from "../../../Domain/errors/app.error";
import { IAuthRepository } from "../../../Domain/repositoryInterface/iAuth.repository";
import { INotificationRepository } from "../../../Domain/repositoryInterface/notification.repository";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { UnifiedGetMyNotificationInputDTO, UnifiedGetMyNotificationOutputDTO } from "../dtos/unified.getMyNotification.dto";
import { IUnifiedGetMyNotificationsUsecase } from "../interfaces/IUnified.getMyNotifications.usecase";

export class UnifiedGetMyNotificationsUsecase implements IUnifiedGetMyNotificationsUsecase {
    constructor(
        private _repositoryRegistry: Map<userRole, IAuthRepository<CandidateEntity | CompanyEntity | AdminEntity>>,
        private _notificationRepository: INotificationRepository
    ) {}

    async execute(request: UnifiedGetMyNotificationInputDTO): Promise<UnifiedGetMyNotificationOutputDTO> {
        const repository = await this._repositoryRegistry.get(request.role)
        const user = await repository?.findById(request.userId)
        if(!user){
            throw new AppError(authMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        const notifications = await this._notificationRepository.findByRecipient(user.id)
        return{
            notifications
        }
    }
}