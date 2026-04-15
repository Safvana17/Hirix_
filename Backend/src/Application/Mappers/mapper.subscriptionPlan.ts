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
            doc.isActive,
            doc.isDeleted,
            doc.canCreateCustomQuestions,
            doc.canUseAdminQuestions,
            doc.maxTestsPerMonth,
            doc.maxCandidates,
            doc.maxJobRolesPerMonth,
            doc.maxInterviewsPerMonth,
            doc.canAccessPremiumQuestions,
            doc.maxPracticePerDay,
            doc.hasDetailedFeedback
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
           isActive: entity.isActive,
           isDeleted: entity.isDeleted,
           canCreateCustomQuestions: entity.canCreateCustomQuestions,
           canUseAdminQuestions: entity.canUseAdminQuestions,
           maxTestsPerMonth: entity.maxTestsPerMonth,
           maxCandidates: entity.maxCandidates,
           maxJobRolesPerMonth: entity.maxJobRolesPerMonth,
           maxInterviewsPerMonth: entity.maxInterviewPerMonth,
           canAccessPremiumQuestions: entity.canAccessPremiumQuestions,
           maxPracticePerDay: entity.maxPracticePerDay,
           hasDetailedFeedback: entity.hasDetailedFeedback
        }
    }
}