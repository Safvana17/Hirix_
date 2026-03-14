import type { UserRole } from "../constants/role";

export interface Company {
    id: string;
    name: string;
    email: string;
    isAdminVerified: boolean;
    status: 'active' | 'blocked' | 'rejected' | 'pending' | ""
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