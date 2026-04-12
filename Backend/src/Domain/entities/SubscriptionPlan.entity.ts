import { BillingCycle, TargetType } from "../enums/subscription";

export class SubscriptionPlanEntity {
    id: string;
    planName: string;
    target: TargetType;
    price: number;
    billingCycle: BillingCycle;
    durationDays: number;

    canCreateCustomQuestions?: boolean
    canUseAdminQuestions?: boolean
    maxTestsPerMonth?: number | null;
    maxCandidates?: number | null;
    maxJobRolesPerMonth?: number | null;
    maxInterviewPerMonth?: number | null

    canAccessPremiumQuestions?: boolean
    maxPracticePerDay?: number | null
    hasDetailedFeedback?: boolean

    isActive: boolean;
    isDeleted: boolean;

    constructor(
        id: string, 
        planName: string, 
        target: TargetType, 
        price: number, 
        billingCycle: BillingCycle, 
        durationDays: number, 
        isActive: boolean, 
        isDeleted: boolean,
        canCreateCustomQuestions?: boolean,
        canUseAdminQuestions?: boolean,
        maxTestsPerMonth?: number| null,
        maxCandidates?: number | null,
        maxJobRolesPerMonth?: number | null,
        maxInterviewsPerMonth?: number | null,
        canAccessPremiumQuestions?: boolean,
        maxPracticePerDay?: number | null,
        hasDetailedFeedback?: boolean
    ){
        this.id = id
        this.planName = planName
        this.target = target
        this.price = price
        this.billingCycle = billingCycle
        this.durationDays = durationDays
        this.isActive = isActive
        this.isDeleted = isDeleted
        this.canCreateCustomQuestions = canCreateCustomQuestions
        this.canUseAdminQuestions = canUseAdminQuestions
        this.maxTestsPerMonth = maxTestsPerMonth
        this.maxCandidates = maxCandidates
        this.maxJobRolesPerMonth = maxJobRolesPerMonth
        this.maxInterviewPerMonth = maxInterviewsPerMonth
        this.canAccessPremiumQuestions = canAccessPremiumQuestions
        this.maxPracticePerDay = maxPracticePerDay
        this.hasDetailedFeedback = hasDetailedFeedback
    }
}