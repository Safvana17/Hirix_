import { CandidateChangePasswordInputDTO, CandidateChangePasswordOutputDTO } from "../../dtos/profile/candidate.changePassword.dto";

export interface ICandidateChangePasswordUsecase {
    execute(request: CandidateChangePasswordInputDTO): Promise<CandidateChangePasswordOutputDTO>
}