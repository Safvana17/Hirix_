import { userStatus } from "../../../../Domain/enums/userStatus.enum"

export interface AdminGetCompanyInputDTO {
     id: string
}

export interface AdminGetCompanyOutputDTO {
     name: string
     email: string
     status: userStatus
}