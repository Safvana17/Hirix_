import CompanyEntity from "../entities/company.entity";
import { IAuthRepository } from "./iAuth.repository";


export default interface ICompanyRepository extends IAuthRepository <CompanyEntity> {
    findByEmail(email: string): Promise<CompanyEntity | null>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
    updateGoogleId(email: string, googleId: string): Promise<CompanyEntity | null>
    findAllFiltered(query: {search?: string, status?: string, page: number, limit: number}): Promise<{data: CompanyEntity[], totalPages: number, totalCount: number}>
}