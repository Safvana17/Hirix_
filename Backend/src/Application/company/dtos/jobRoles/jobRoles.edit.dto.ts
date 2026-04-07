import jobRoleStatus from "../../../../Domain/enums/jobRoleStatus";

export interface EditJobRolesInputDTO{
    id: string
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number;
    userId: string
}

export interface EditJobRolesOutputDTO {
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number;
    status: jobRoleStatus
}