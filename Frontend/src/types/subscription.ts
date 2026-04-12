export type TargetType = 'company' | 'candidate' | 'all'
export type BillingCycle = 'monthly' | 'yearly'

export interface SubscriptionPlan {
    id: string;
    planName: string;
    target: TargetType;
    price: number;
    billingCycle: BillingCycle;
    durationDays: number;
    canCreateCustomQuestions?: boolean;
    canUseAdminQuestions?: boolean;
    maxCandidates?: number | null;
    maxTestsPerMonth?: number | null;
    maxJobRolesPerMonth?: number | null;
    maxInterviewsPerMonth?: number | null;
    canAccessPremiumQuestions?: boolean;
    maxPracticePerDay?: number | null;
    hasDetailedFeedback?: boolean;
    isActive: boolean
    isDeleted: boolean
}

export interface CreatePlanPayload {
    planName: string
    target: TargetType
    price: number
    billingCycle: BillingCycle
    durationDays: number
    canCreateCustomQuestions?: boolean;
    canUseAdminQuestions?: boolean;
    maxCandidates?: number | null;
    maxTestsPerMonth?: number | null;
    maxJobRolesPerMonth?: number | null;
    maxInterviewsPerMonth?: number | null;
    canAccessPremiumQuestions?: boolean;
    maxPracticePerDay?: number | null;
    hasDetailedFeedback?: boolean;
}

export type ModalMode = 'create' | 'edit'