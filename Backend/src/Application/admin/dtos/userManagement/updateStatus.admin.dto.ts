import userRole from "../../../../Domain/enums/userRole.enum";
import { userStatus } from "../../../../Domain/enums/userStatus.enum"

export interface UpdataStatusInputDTO {
    id: string
    status: userStatus
}

export interface UpdateStatusOutputDTO {
        id: string;
        status: userStatus;
        role: userRole
}