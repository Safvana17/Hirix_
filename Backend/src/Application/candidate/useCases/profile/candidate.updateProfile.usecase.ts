import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateUpdateProfileInputDTO, CandidateUpdateProfileOutputDTO } from "../../dtos/profile/candidate.updateProfile.dto";
import { ICandidateUpdateProfileUsecase } from "../../interfaces/profile/ICandidate.updateProfile.usecase";

export class CandidateUpdateProfileUsecase implements ICandidateUpdateProfileUsecase {
    constructor (
        private _candidateRepository: ICandidateRepository
    ) {}

    async execute(request: CandidateUpdateProfileInputDTO): Promise<CandidateUpdateProfileOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        candidate.canidateType = request.canidateType
        candidate.college = request.college
        candidate.degree = request.degree
        candidate.greduationYear = request.greduationYear
        candidate.company = request.company
        candidate.designation = request.designation
        candidate.yearsOfExperience = request.yearsOfExperience
        candidate.portfolioUrl = request.portfolioUrl
        candidate.githubUrl = request.githubUrl
        candidate.linkedinUrl = request.linkedinUrl
        candidate.skills = request.skills
        candidate.interestedRoles = request.interestedRoles

        await this._candidateRepository.update(candidate.id, candidate)

        return {
            success: true
        }
    }
}