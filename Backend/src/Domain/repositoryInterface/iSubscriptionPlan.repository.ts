import { SubscriptionPlanEntity } from "../entities/SubscriptionPlan.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlanEntity>{
    findByName(name: string): Promise<SubscriptionPlanEntity | null>
}