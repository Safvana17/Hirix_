import CandidateEntity from "../../../Domain/entities/candidate.entity";
import CompanyEntity from "../../../Domain/entities/company.entity";
import { NotificationEvents } from "../../../Domain/enums/notification";
import { TargetType } from "../../../Domain/enums/subscription";
import { IAuthRepository } from "../../../Domain/repositoryInterface/iAuth.repository";
import { ISubscriptionRepository } from "../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { IAdminProcessNotificationUsecase } from "../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { IMailService } from "../../interface/service/IMailService";
import { ISendExpireSubscriptionReminderUsecase } from "../interfaces/ISendExpireReminder.usecase";

export class SendExpireSubscriptionReminderUsecase implements ISendExpireSubscriptionReminderUsecase{
    constructor(
        private _repositoryRegistry: Map<TargetType, IAuthRepository<CandidateEntity | CompanyEntity>>,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _mailService: IMailService,
        private _processNotification: IAdminProcessNotificationUsecase
    ) {}

    async execute(): Promise<void> {
        const now = new Date()
        const threeDaysLater = new Date()
        threeDaysLater.setDate(now.getDate() + 3)
        const expiringSoon = await this._subscriptionRepository.findExpiringSoon(threeDaysLater)
        if(!expiringSoon?.length) return

        for(let sub of expiringSoon){
            const plan = await this._subscriptionPlanRepository.findById(sub.planId)
            if(!plan) continue

            const repository = await this._repositoryRegistry.get(sub.ownerType)
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
        }
    }
}