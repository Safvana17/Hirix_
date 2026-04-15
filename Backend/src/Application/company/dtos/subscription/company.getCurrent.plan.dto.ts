import { BillingCycle, subscriptionStatus } from "../../../../Domain/enums/subscription";

export interface CompanyGetCurrentPlanInputDTO {
    id: string
}

export interface CompanyGetCurrentPlanOutputDTO {
  id: string,
  planName: string;
  price: number;
  startDate: Date;
  endDate: Date | null;
  status: subscriptionStatus;
  billingCycle: BillingCycle;
  maxTestsPerMonth: number | null;
  maxCandidates: number | null;
  maxInterviewPerMonth: number | null;
  maxJobRolesPerMonth: number | null;
  maxPracticePerDay: number | null;
}