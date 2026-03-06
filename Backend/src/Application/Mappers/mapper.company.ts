import CompanyEntity from "../../Domain/entities/company.entity";
import { ICompany } from "../../Infrastructure/database/Model/company";

export class CompanyMapper {
    static toEntity(doc: ICompany): CompanyEntity {
        const company = new CompanyEntity (
            doc.name,
            doc.email,
            doc.password,
            doc.isVerified,
            doc._id.toString(),
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
            password: entity.getPassword(),
            googleId: entity.getGoogleId?.(),
            isVerified: entity.isUserVerified(),
            refreshToken: entity.getRefreshToken()
        }
    }
}