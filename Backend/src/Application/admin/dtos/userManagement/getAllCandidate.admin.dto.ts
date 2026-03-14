import { UserStatus } from "../../../../Domain/enums/userStatus.enum";

export interface GetAllCandidatesOutputDTO {
    id: string;
    name: string;
    email: string;
    status: UserStatus;
}

export interface AdminCandidateQueryDTO {
    search?: string;
    status?: string;
    page: number;
    limit: number
}

export interface AdminPaginatedCandidateDTO {
    candidates: GetAllCandidatesOutputDTO[];
    totalPages: number;
    totalCount: number
}