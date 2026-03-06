import CompanyEntity from "../entities/company.entity";
import { IBaseRepository } from "./iBase.repository";

export default interface ICompanyRepository extends IBaseRepository <CompanyEntity> {
    findByEmail(email: string): Promise<CompanyEntity | null>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
    // updateToken(id: string, token: string): Promise<void>
    updateGoogleId(email: string, googleId: string): Promise<CompanyEntity | null>
    // revokeRefreshToken(hashedToken: string): Promise<void>
}