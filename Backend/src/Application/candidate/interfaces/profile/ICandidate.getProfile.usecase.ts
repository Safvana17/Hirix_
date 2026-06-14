import { CandidateGetProfileInputDTO, CandidateGetProfileOutputDTO } from "../../dtos/profile/candidate.getProfile.dto";

export interface ICandidateGetProfileUsecase {
    execute(request: CandidateGetProfileInputDTO): Promise<CandidateGetProfileOutputDTO>
}