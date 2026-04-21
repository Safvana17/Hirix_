import CandidateEntity from "../../../Domain/entities/candidate.entity";
import CompanyEntity from "../../../Domain/entities/company.entity";
import { TargetType } from "../../../Domain/enums/subscription";
import { IAuthRepository } from "../../../Domain/repositoryInterface/iAuth.repository";
import { ISubscriptionRepository } from "../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { IMailService } from "../../interface/service/IMailService";
import { ISendExpireSubscriptionReminderUsecase } from "../interfaces/ISendExpireReminder.usecase";

export class SendExpireSubscriptionReminderUsecase implements ISendExpireSubscriptionReminderUsecase{
    constructor(
        private _repositoryRegistry: Map<TargetType, IAuthRepository<CandidateEntity | CompanyEntity>>,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _mailService: IMailService
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
            // const endDate = sub.endDate!
            // await this._mailService.sendSubscriptionReminder(user.getEmail(), user.getName(), plan.planName, endDate.toLocaleDateString())
        }
    }
}