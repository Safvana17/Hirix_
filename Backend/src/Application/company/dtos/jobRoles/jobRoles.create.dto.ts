export interface CreateJobRolesInputDTO{
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number
}

export interface CreateJobRolesOutputDTO {
    success: boolean
}