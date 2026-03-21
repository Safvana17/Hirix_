import AdminEntity from "../entities/admin.entity";
import { IAuthRepository } from "./iAuth.repository";


export default interface IAdminRepository extends IAuthRepository<AdminEntity> {
    findByEmail(email: string): Promise<AdminEntity | null>
    // updateToken(id: string, token: string): Promise<void>
    // revokeRefreshToken(token: string) : Promise<void>
}