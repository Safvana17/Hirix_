import userRole from "../../../../Domain/enums/userRole.enum";
import { UserStatus } from "../../../../Domain/enums/userStatus.enum"

export interface UpdataStatusInputDTO {
    id: string
    status: UserStatus
}

export interface UpdateStatusOutputDTO {
        id: string;
        status: UserStatus;
        role: userRole
}

export interface AdminApproveCompanyInputDTO {
    id: string
}

export interface AdminRejectCompanyInputDTO {
    id: string
    reason: string
}