export type TargetType = 'company' | 'candidate'
export type BillingCycle = 'monthly' | 'yearly' | 'forever'

export interface SubscriptionPlan {
    id: string;
    planName: string;
    target: TargetType;
    price: number;
    billingCycle: BillingCycle;
    durationDays: number | null;
    canCreateCustomQuestions?: boolean;
    canUseAdminQuestions?: boolean;
    maxCandidates?: number | null;
    maxTestsPerMonth?: number | null;
    maxJobRolesPerMonth?: number | null;
    maxInterviewPerMonth?: number | null;
    canAccessPremiumQuestions?: boolean;
    maxPracticePerDay?: number | null;
    hasDetailedFeedback?: boolean;
    isActive: boolean
    isDeleted: boolean
}

export interface PlanPayload {
    id: string;
    planName: string
    target: TargetType
    price: number
    billingCycle: BillingCycle
    // durationDays: number | null
    canCreateCustomQuestions?: boolean;
    canUseAdminQuestions?: boolean;
    maxCandidates?: number | null;
    maxTestsPerMonth?: number | null;
    maxJobRolesPerMonth?: number | null;
    maxInterviewPerMonth?: number | null;
    canAccessPremiumQuestions?: boolean;
    maxPracticePerDay?: number | null;
    hasDetailedFeedback?: boolean;
    isActive?: boolean
    isDeleted?: boolean
}

export type ModalMode = 'create' | 'edit'


export type getAllPlansParams = {
  target?: TargetType
  page?: number
  limit?: number
}

export type userGetAllPlansParams = {
  target: TargetType
  page?: number
  limit?: number
}
export interface GetAllPlansResponse{
    subscriptionPlans: SubscriptionPlan[]
    totalPages: number
    totalCount: number
}

export type UpdatePlanStatusPayload = {
  id: string
  status: 'activate' | 'deactivate' 
}

export type DeletePlanPayload = {
  id: string
}

export interface CurrentPlan {
  id: string;
  planName: string;
  price: number;
  startDate: Date;    
  endDate: Date | null;
  status: 'active' | 'expired' | 'cancelled';
  billingCycle: BillingCycle;
  maxTestsPerMonth: number | null;
  maxCandidates: number | null;
  maxInterviewPerMonth: number | null;
  maxJobRolesPerMonth: number | null;
  maxPracticePerDay: number | null;
}
 
export interface ChangePlanResponse {
  newPlan: SubscriptionPlan
  isPaymentRequired: boolean
}