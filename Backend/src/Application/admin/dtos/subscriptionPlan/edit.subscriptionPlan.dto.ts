import { SubscriptionPlanEntity } from "../../../../Domain/entities/SubscriptionPlan.entity";
import { BillingCycle, TargetType } from "../../../../Domain/enums/subscription";

export interface AdminEditSubscriptionPlanInputDTO {
    id: string;
    planName: string;
    target: TargetType;
    price: number;
    billingCycle: BillingCycle;
    // durationDays: number;
    canCreateCustomQuestions?: boolean;
    canUseAdminQuestions?: boolean;
    maxCandidates?: number | null;
    maxTestsPerMonth?: number | null;
    maxInterviewsPerMonth?: number | null;
    maxJobRolesPerMonth?: number | null;
    canAccessPremiumQuestions?: boolean;
    maxPracticePerDay?: number | null
    hasDetailedFeedback?: boolean
    isTrialEnabled: boolean
    trialDays: number
}

export interface AdminEditSubscriptionPlanOutputDTO {
    plan: SubscriptionPlanEntity
}