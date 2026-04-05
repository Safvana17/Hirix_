import { UserStatus } from "../../../../Domain/enums/userStatus.enum"

export interface AdminGetCompanyInputDTO {
     id: string
}

export interface AdminGetCompanyOutputDTO {
     id: string
     name: string
     email: string
     status: UserStatus
}