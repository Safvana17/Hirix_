import CandidateEntity from "../../Domain/entities/candidate.entity";
import { ICandidate } from "../../Infrastructure/database/Model/candidate";

export class candidateMapper {
    static toEntity(doc: ICandidate): CandidateEntity {
        const candidate = new CandidateEntity(
            doc.name,
            doc.email,
            doc.password,
            doc.isVerified,
            doc._id.toString(),
            doc.googleId,
            doc.refreshToken ?? []
        )
        return candidate
    }

    static toDocument(entity: CandidateEntity){
        return {
            name: entity.getName(),
            email: entity.getEmail(),
            password: entity.getPassword(),
            role: entity.getRole(),
            googleId: entity.getGoogleId?.(),
            isVerified: entity.isUserVerified(),
            refreshTokens: entity.getRefreshToken()
        }
    }
}