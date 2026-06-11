import CandidateEntity from "../entities/Candidate.entity";
import { IAuthRepository } from "./iAuth.repository";


export default interface ICandidateRepository extends IAuthRepository <CandidateEntity> {
    findByEmail(email: string): Promise<CandidateEntity | null>;
    updatePassword(id: string, hashedPassword: string): Promise<void>;
    updateGoogleId(email: string, googleId: string): Promise<CandidateEntity | null>
    findAllFiltered(query: {search?: string, status?: string, page: number, limit: number}): Promise<{data: CandidateEntity[], totalPages: number, totalCount: number}>
    getTotalCandidates(): Promise<number>
}