export interface JobRole {
    id: string
    name: string
    skills: string[]
    experienceMin: number
    experienceMax: number
    openings: number
    status: string
}

export interface createJobRolePayload {
    name: string;
    skills: string[]
    experienceMin: number
    experienceMax: number
    openings: number
}

export interface editJobRolePayload {
    id: string
    name: string;
    skills: string[]
    experienceMin: number
    experienceMax: number
    openings: number
}

export type getAllJobRolesParams = {
  search?: string
  status?: string
  page?: number
  limit?: number
}

export type ModalMode = 'create' | 'edit' | 'view'

export interface GetAllJobRolesResponse{
    jobRoles: JobRole[]
    totalPages: number
    totalCount: number
}

export type UpdateJobRoleStatusPayload = {
  id: string
  status: 'Active' | 'Closed' 
}

export type DeleteJobRoleResponse = {
  id: string
}
export type UpdateJobRoleStatusArgs = {
  id: string
  status: 'Active' | 'Closed' | ""
  queryParams?: getAllJobRolesParams
}