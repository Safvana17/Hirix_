export interface Company {
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Blocked',
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