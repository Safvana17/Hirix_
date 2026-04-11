import { SubscriptionPlanEntity } from "../../Domain/entities/SubscriptionPlan.entity";
import { ISubscriptionPlan } from "../../Infrastructure/database/Model/SubscriptionPlan";

export class SubscriptionPlanMapper {
    static toEntity(doc: ISubscriptionPlan): SubscriptionPlanEntity {
        const plan = new SubscriptionPlanEntity(
            doc._id.toString(),
            doc.planName,
            doc.target,
            doc.price,
            doc.billingCycle, 
            doc.durationDays,
            doc.maxTestsPerMonth,
            doc.maxCandidates,
            doc.features,
            doc.isActive,
            doc.isDeleted
        )

        return plan
    }

    static toDocument(entity: SubscriptionPlanEntity){
        return {
           planName: entity.planName,
           target: entity.target,
           price: entity.price,
           billingCycle: entity.billingCycle,
           durationDays: entity.durationDays,
           maxTestsPerMonth: entity.maxTestsPerMonth,
           maxCandidates: entity.maxCandidates,
           isActive: entity.isActive,
           isDeleted: entity.isDeleted
        }
    }
}