export interface JobRole {
    id?: string
    name: string
    skills: string[]
    experienceMin: number
    experienceMax: number
    openings: number
}

export interface createJobRolePayload {
    name: string;
    skills: string[]
    experienceMin: number
    experienceMax: number
    openings: number
}