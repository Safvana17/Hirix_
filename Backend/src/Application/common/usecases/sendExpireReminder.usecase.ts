import CandidateEntity from "../../../Domain/entities/Candidate.entity";
import CompanyEntity from "../../../Domain/entities/Company.entity";
import { NotificationEvents } from "../../../Domain/enums/notification";
import { TargetType } from "../../../Domain/enums/subscription";
import userRole from "../../../Domain/enums/userRole.enum";
import { IAuthRepository } from "../../../Domain/repositoryInterface/iAuth.repository";
import { ISubscriptionRepository } from "../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { IAdminProcessNotificationUsecase } from "../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { ISendExpireSubscriptionReminderUsecase } from "../interfaces/ISendExpireReminder.usecase";

export class SendExpireSubscriptionReminderUsecase implements ISendExpireSubscriptionReminderUsecase{
    constructor(
        private _repositoryRegistry: Map<userRole, IAuthRepository<CandidateEntity | CompanyEntity>>,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _processNotification: IAdminProcessNotificationUsecase
    ) {}

    async execute(): Promise<void> {
        const now = new Date()
        const threeDaysLater = new Date()
        threeDaysLater.setDate(now.getDate() + 3)
        const expiringSoon = await this._subscriptionRepository.findExpiringSoon(threeDaysLater)
        if(!expiringSoon?.length) return

        for(let sub of expiringSoon){
            if(sub.isReminderSend) continue
            const plan = await this._subscriptionPlanRepository.findById(sub.planId)
            if(!plan) continue
            const role = sub.ownerType === TargetType.COMPANY ? userRole.Company : userRole.Candidate
            const repository = await this._repositoryRegistry.get(role)
            const user = await repository?.findById(sub.ownerId) 
            if(!user) continue
            const endDate = sub.endDate!
            await this._processNotification.execute({
                event: NotificationEvents.SUBSCRIPTION_REMINDER,
                recipients: [{
                    recipientId: user.id,
                    recipientType: user.getRole(),
                    email: user.getEmail()
                }],
                variables: {
                    companyName: user.getName(),
                    platformName: "Hirix",
                    expiryDate: endDate.toLocaleDateString(),
                    subscriptionUrl: `http://localhost:5173/${user.getRole()}/subscription`
                }
            })
            sub.isReminderSend = true
            await this._subscriptionRepository.update(sub.id, sub)
        }
    }
}