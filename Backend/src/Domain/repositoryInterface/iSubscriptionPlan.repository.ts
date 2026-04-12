import { SubscriptionPlanEntity } from "../entities/SubscriptionPlan.entity";
import { TargetType } from "../enums/subscription";
import { IBaseRepository } from "./iBase.repository";

export interface ISubscriptionPlanRepository extends IBaseRepository<SubscriptionPlanEntity>{
    findByNameAndTarget(name: string, target: TargetType): Promise<SubscriptionPlanEntity | null>
}