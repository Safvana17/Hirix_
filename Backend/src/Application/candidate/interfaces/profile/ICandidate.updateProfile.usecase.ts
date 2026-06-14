import { CandidateUpdateProfileInputDTO, CandidateUpdateProfileOutputDTO } from "../../dtos/profile/candidate.updateProfile.dto";

export interface ICandidateUpdateProfileUsecase {
    execute(request: CandidateUpdateProfileInputDTO): Promise<CandidateUpdateProfileOutputDTO>
}