import jobRoleStatus from "../../../../Domain/enums/jobRoleStatus";

export interface GetAllJobRolesOutputDTO {
    id: string;
    name: string;
    skills: string[];
    experienceMin: number
    experienceMax: number
    openings: number
    status: jobRoleStatus;
}

export interface JobRolesQueryDTO {
    search?: string;
    status?: string;
    page: number;
    limit: number
}

export interface PaginatedJobRolesDTO {
    jobRoles: GetAllJobRolesOutputDTO[];
    totalPages: number;
    totalCount: number
}