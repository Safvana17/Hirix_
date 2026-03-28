import { DeleteReason } from "../../../../Domain/enums/deleteReason";

export interface DeleteAccountInputDTO{
    id: string;
    password: string;
    reason: DeleteReason;
    feedback?: string
}

export interface DeleteAccountOutputDTO {
    success: boolean
}