import CandidateEntity from "../../Domain/entities/Candidate.entity";
import { ICandidate } from "../../Infrastructure/database/Model/Candidate";

export class candidateMapper {
    static toEntity(doc: ICandidate): CandidateEntity {
        const candidate = new CandidateEntity(
            doc._id.toString(),
            doc.name,
            doc.email,
            doc.password,
            doc.isVerified,
            doc.isBlocked,
            doc.status,
            doc.googleId,
            doc.refreshToken ?? []
        )
        candidate.correctPracticeAnswers = doc.correctPracticeAnswers
        candidate.practiceQuestionCount = doc.practiceQuestionCount
        candidate.profilePicture = doc.profilePicture
        candidate.canidateType = doc.canidateType
        candidate.college = doc.college
        candidate.degree = doc.degree
        candidate.greduationYear = doc.greduationYear
        candidate.company = doc.company
        candidate.designation = doc.designation
        candidate.yearsOfExperience = doc.yearsOfExperience
        candidate.skills = doc.skills
        candidate.interestedRoles = doc.interestedRoles
        candidate.linkedinUrl = doc.linkedinUrl
        candidate.githubUrl = doc.githubUrl
        candidate.portfolioUrl = doc.portfolioUrl
        candidate.attendedQuestionIds = doc.attendedQuestionIds

        return candidate
    }

    static toDocument(entity: CandidateEntity){
        return {
            name: entity.getName(),
            email: entity.getEmail(),
            password: entity.getPassword(),
            role: entity.getRole(),
            status: entity.getStatus(),
            googleId: entity.getGoogleId?.(),
            isVerified: entity.isUserVerified(),
            refreshTokens: entity.getRefreshToken(),
            isBlocked: entity.getIsBlocked(),
            correctPracticeAnswers: entity.correctPracticeAnswers,
            practiceQuestionCount: entity.practiceQuestionCount,
            profilePicture: entity.profilePicture,
            candidateType: entity.canidateType,
            degree: entity.degree,
            graduationYear: entity.greduationYear,
            company: entity.company,
            designation: entity.designation,
            yearsOfExperience: entity.yearsOfExperience,
            skills: entity.skills,
            interestedRoles: entity.interestedRoles,
            linkedinUrl: entity.linkedinUrl,
            githubUrl: entity.githubUrl,
            portfolioUrl: entity.portfolioUrl,
            attendedQuestionIds: entity.attendedQuestionIds
        }
    }
}