import type { InterviewStatus } from "./interview";

export interface Candidate{
    id: string;
    name: string;
    email: string;
    status: 'active' | 'blocked' | 'rejected' | 'pending' | ""
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

export interface ChangePassword {
    id: string
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export interface InterviewHistory {
    id: string
    companyName: string
    interviewName: string
    jobRole: string
    status: InterviewStatus
    interviewerName:string
    date: string
}

export interface InterviewHistoryResponse {
    history: InterviewHistory[]
    totalCount: number
    totalPages: number
}

export interface InterviewHistoryArgs {
    page?: number
    limit?: number
}