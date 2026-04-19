import { subscriptionStatus } from "../../../Domain/enums/subscription";
import { AppError } from "../../../Domain/errors/app.error";
import { ISubscriptionRepository } from "../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { subscriptionPlanMessages } from "../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { IMarkExpiredUsecase } from "../interfaces/IMarkExpired.usecase";

export class MarkSubscriptionExpired implements IMarkExpiredUsecase{
    constructor(
         private _subscriptionRepository: ISubscriptionRepository,
         private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(): Promise<void> {
        const expiredSubscription = await this._subscriptionRepository.findExpiredActive()
        if(!expiredSubscription?.length) return
        for(let sub of expiredSubscription){
            sub.status = subscriptionStatus.EXPIRED
            sub.isCurrent = false
            await this._subscriptionRepository.update(sub.id, sub)

            const newPlan = await this._subscriptionPlanRepository.findFreePlan(sub.ownerType)
            if(!newPlan){
                throw new AppError(subscriptionPlanMessages.error.MISSING_FREE_PLAN, statusCode.NOT_FOUND)
            }

            await this._subscriptionRepository.create({
                id: '',
                ownerType: sub.ownerType,
                ownerId: sub.ownerId,
                planId: newPlan.id,
                startDate: new Date(),
                endDate: null,
                status: subscriptionStatus.ACTIVE,
                isCurrent: true,
            })
        }
    }
}