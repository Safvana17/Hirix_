import jobRoleStatus from "../../../../Domain/enums/jobRoleStatus"

export interface UpdateJobRoleStatusInputDTO{
    id: string
    status: jobRoleStatus
}

export interface UpdateJobRoleStatusOutputDTO {
    id: string
    status: jobRoleStatus
}