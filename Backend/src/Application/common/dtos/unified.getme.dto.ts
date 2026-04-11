import userRole from "../../../Domain/enums/userRole.enum";

export interface UnifiedGetMeInputDTO {
    id: string
    role: userRole
}

export interface UnifiedGetMeOutputDTO {
        id: string
        name: string;
        email: string;
        role: userRole;
        isAdminVerified?: boolean;
        isProfileUpdated?: boolean
}