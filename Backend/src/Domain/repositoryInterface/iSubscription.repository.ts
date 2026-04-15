import { SubscriptionEntity } from "../entities/Subscription.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
     findCurrentByUserId(userId: string): Promise<SubscriptionEntity | null>
}