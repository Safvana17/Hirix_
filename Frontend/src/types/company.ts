import type { UserRole } from "../constants/role";

export interface Company {
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Blocked' | "",
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
  status: 'Active' | 'Blocked' | ""
  role: UserRole
}

export type UpdateStatusArgs = {
  id: string
  status: 'Active' | 'Blocked' | ""
  role: UserRole
  queryParams?: FetchCompaniesParams
}