import { SubscriptionEntity } from "../entities/Subscription.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
     findCurrentByUserId(userId: string): Promise<SubscriptionEntity | null>
     findExpiringSoon(expiringDate: Date): Promise<SubscriptionEntity[] | null>
     findExpiredActive(): Promise<SubscriptionEntity[] | null>
     findTrialByUserAndPlan(userId: string, planId: string): Promise<SubscriptionEntity | null>
}