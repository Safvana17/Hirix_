import jobRoleStatus from "../../../../Domain/enums/jobRoleStatus";

export interface CreateJobRolesInputDTO{
    companyId: string;
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number;
}

export interface CreateJobRolesOutputDTO {
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number;
    status: jobRoleStatus
}