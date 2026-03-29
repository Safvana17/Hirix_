import type { DeleteReason } from "../constants/deleteReason";
import type { UserRole } from "../constants/role";

export interface Company {
    id: string;
    name: string;
    email: string;
    isAdminVerified: boolean;
    status: 'active' | 'blocked' | 'rejected' | 'pending' | ""
}

export interface CompanySettings extends Company {
  legalName?: string
  profileLogo?: string
  domain?: string
  website?: string
  teamSize?: number
  about?: string
  phoneNumber?: string
  streetName?: string
  country?: string
  state?: string
  city?: string
  pinCode?: string
  primaryContactName?: string
  billingEmail?: string
  subscriptionPlan?: string
  maxCandidates?: number
  maxTestPerMonth?: string
}

export type FetchCompaniesParams = {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface FetchCompaniesResponse{
    companies: Company[]
    totalPages: number
    totalCount: number
}

export interface changePasswordPayload {
  id: string
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface deleteAccountPayload {
  id: string,
  password: string
  reason: DeleteReason
  feedback: string
}

export interface restoreAccountPayload {
  email: string
  password: string
}

export type UpdateStatusPayload = {
  id: string
  status: 'active' | 'blocked' | 'rejected' | 'pending' | ""
  role: UserRole
}

export type UpdateStatusArgs = {
  id: string
  status: 'active' | 'blocked' | ""
  role: UserRole
  queryParams?: FetchCompaniesParams
}

// export type VerifyCompanyPayload = {
//   id: string
//   action: "APPROVE" | "REJECT"
//   reason?: string
// }

export type ApproveCompanyArgs = {
  id: string
  action: "APPROVE"
  queryParams?: FetchCompaniesParams
}

export type RejectCompanyArgs = {
  id: string
  reason?: string
  action: "REJECT"
  queryParams?: FetchCompaniesParams
}

export type UpdateCompanyProfilePayload = Omit<
  CompanySettings,
  'id' | 'email' | 'isAdminVerified' | 'status'
>