import AdminEntity from "../../Domain/entities/admin.entity";
import { IAdmin } from "../../Infrastructure/database/Model/admin";

export class AdminMapper {
    static toEntity(doc: IAdmin): AdminEntity {
        const admin = new AdminEntity(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.password,
            doc.isVerified,
            false,
            "",
            doc.refreshTokens ?? []
        )

        return admin
    }

    static toDocument(entity: AdminEntity){
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