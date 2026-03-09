export interface Candidate{
    id: string;
    name: string;
    email: string;
    status: 'Active' | 'Blocked' | "";
}

export type FetchCandidatesParams = {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export interface FetchCandidatesResponse{
    candidates: Candidate[]
    totalCount: number
    totalPages: number
}