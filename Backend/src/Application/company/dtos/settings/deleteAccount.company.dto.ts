import { DeleteReason } from "../../../../Domain/enums/deleteReason";
import userRole from "../../../../Domain/enums/userRole.enum";

export interface DeleteAccountInputDTO{
    id: string;
    password: string;
    reason: DeleteReason;
    feedback?: string
}

export interface DeleteAccountOutputDTO {
    success: boolean
}

export interface SendRestoreAccountEmailInputDTO{
    email: string
    role: userRole
}

export interface SendRestoreAccountEmailOutputDTO {
    success: boolean
}