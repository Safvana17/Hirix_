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
            doc.refreshToken ?? [],
        )

        company.legalName = doc.legalName
        company.domain = doc.domain
        company.website = doc.website
        company.teamSize = doc.teamSize
        company.about = doc.about
        company.phoneNumber = doc.phoneNumber
        company.streetName = doc.streetName
        company.country = doc.country
        company.state = doc.state
        company.city = doc.city
        company.pinCode = doc.pinCode
        company.primaryContactName = doc.primaryContactName
        company.billingEmail = doc.billingEmail

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
            isBlocked: entity.getIsBlocked(),
            legalName: entity.legalName,
            domain: entity.domain,
            website: entity.website,
            teamSize: entity.teamSize,
            about: entity.about,
            streetName: entity.streetName,
            city: entity.city,
            state: entity.state,
            country: entity.country,
            pinCode: entity.pinCode,
            primaryContactName: entity.primaryContactName,
            billingEmail: entity.billingEmail,
            phoneNumber: entity.phoneNumber
        }
    }
}