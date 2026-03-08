import { userStatus } from "../../../../Domain/enums/userStatus.enum"

export interface UpdataStatusInputDTO {
    id: string
    status: userStatus
}

export interface UpdateStatusOutputDTO {
    success: boolean
}