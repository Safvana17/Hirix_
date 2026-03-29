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

export interface GetDeletedAccountDetailsInputDTO{
    token: string
}

export interface GetDeletedAccountDetailsOutputDTO {
    email: string
    name: string
}

export interface ConfirmRestoreAccountInputDto {
    token: string
}

export interface ConfirmRestoreAccountOutputDto {
    accessToken: string
    refreshToken: string
    csrfToken: string
    company: {
        id: string,
        name: string,
        email: string,
        role: string
    }
}