import AdminEntity from "../entities/admin.entity";
import { IBaseRepository } from "./iBase.repository";

export default interface IAdminRepository extends IBaseRepository <AdminEntity> {
    findByEmail(email: string): Promise<AdminEntity | null>
    // updateToken(id: string, token: string): Promise<void>
    // revokeRefreshToken(token: string) : Promise<void>
}