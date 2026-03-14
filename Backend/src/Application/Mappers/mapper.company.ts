import CompanyEntity from "../../Domain/entities/company.entity";
import { ICompany } from "../../Infrastructure/database/Model/company";

export class CompanyMapper {
    static toEntity(doc: ICompany): CompanyEntity {
        const company = new CompanyEntity (
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.password,
            doc.isVerified,
            doc.isBlocked,
            doc.isAdminVerified,
            doc.status,
            doc.googleId,
            doc.refreshToken ?? []
        )

        return company
    }

    static toDocument(entity: CompanyEntity){
        return {
            name: entity.getName(),
            email: entity.getEmail(),
            role: entity.getRole(),
            status: entity.getStatus(),
            isAdminVerified: entity.getIsAdminVerified(),
            password: entity.getPassword(),
            googleId: entity.getGoogleId?.(),
            isVerified: entity.isUserVerified(),
            refreshToken: entity.getRefreshToken(),
            isBlocked: entity.getIsBlocked()
        }
    }
}