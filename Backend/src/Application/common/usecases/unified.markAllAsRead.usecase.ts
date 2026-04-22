import { IUnifiedMarkAllAsReadUsecase } from "../interfaces/IUnified.allMarkAsRead.usecase";
import AdminEntity from "../../../Domain/entities/admin.entity";
import CandidateEntity from "../../../Domain/entities/candidate.entity";
import CompanyEntity from "../../../Domain/entities/company.entity";
import userRole from "../../../Domain/enums/userRole.enum";
import { INotificationRepository } from "../../../Domain/repositoryInterface/notification.repository";
import { IAuthRepository } from "../../../Domain/repositoryInterface/iAuth.repository";
import { UnifiedMarkAllAsReadInoutDTO } from "../dtos/unified.markAllAsRead.dto";
import { AppError } from "../../../Domain/errors/app.error";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";


export class UnifiedMarkAllAsReadUsecase implements IUnifiedMarkAllAsReadUsecase {
    constructor(
        private _repositoryRegistry: Map<userRole, IAuthRepository<CandidateEntity | CompanyEntity | AdminEntity>>,
        private _notificationRepository: INotificationRepository
    ) {}

    async execute(request: UnifiedMarkAllAsReadInoutDTO): Promise<void> {
        const repository = await this._repositoryRegistry.get(request.role)
        const user = await repository?.findById(request.userId)
        if(!user){
            throw new AppError(authMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        await this._notificationRepository.markAllAsRead(user.id)
    }

}