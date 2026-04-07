import jobRoleStatus from "../../../../Domain/enums/jobRoleStatus";

export interface CreateJobRolesInputDTO{
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number;
    userId: string;
}

export interface CreateJobRolesOutputDTO {
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number;
    status: jobRoleStatus
}