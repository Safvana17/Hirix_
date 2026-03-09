import CandidateEntity from "../entities/candidate.entity";
import { IBaseRepository } from "./iBase.repository";

export default interface ICandidateRepository extends IBaseRepository <CandidateEntity> {
    findByEmail(email: string): Promise<CandidateEntity | null>;
    // save(candidate: CandidateEntity): Promise<void>
    updatePassword(id: string, hashedPassword: string): Promise<void>;
    // updateToken(id: string, token: string): Promise<void>;
    updateGoogleId(email: string, googleId: string): Promise<CandidateEntity | null>
    // revokeRefreshToken(hashedToken: string): Promise<void>
    findAllFiltered(query: {search?: string, status?: string, page: number, limit: number}): Promise<{data: CandidateEntity[], totalPages: number, totalCount: number}>
}