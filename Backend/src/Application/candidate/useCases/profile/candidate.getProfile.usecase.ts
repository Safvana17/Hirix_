import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateGetProfileInputDTO, CandidateGetProfileOutputDTO } from "../../dtos/profile/candidate.getProfile.dto";
import { ICandidateGetProfileUsecase } from "../../interfaces/profile/ICandidate.getProfile.usecase";

export class CandidateGetProfileUsecase implements ICandidateGetProfileUsecase {
    constructor (
        private _candidateRepository: ICandidateRepository
    ) {}

    async execute(request: CandidateGetProfileInputDTO): Promise<CandidateGetProfileOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return {
            id: candidate.id,
            name: candidate.getName(),
            email: candidate.getEmail(),
            profilePicture: candidate.profilePicture,
            candidateType: candidate.candidateType,
            college: candidate.college,
            degree: candidate.degree,
            company: candidate.company,
            greduationYear: candidate.greduationYear,
            yearsOfExperience: candidate.yearsOfExperience,
            designation: candidate.designation,
            skills: candidate.skills,
            interestedRoles: candidate.interestedRoles,
            linkedinUrl: candidate.linkedinUrl,
            githubUrl: candidate.githubUrl,
            portfolioUrl: candidate.portfolioUrl
        }
    }
}