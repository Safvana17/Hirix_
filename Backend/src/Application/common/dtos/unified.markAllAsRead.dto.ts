import userRole from "../../../Domain/enums/userRole.enum"

export interface UnifiedMarkAllAsReadInoutDTO {
    userId: string
    role: userRole
}