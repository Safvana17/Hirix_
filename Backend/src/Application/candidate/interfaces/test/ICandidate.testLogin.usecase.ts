import { CandidateTestLoginInputDTO, CandidateTestLoginOutputDTO } from "../../dtos/test/candidate.testLogin.dto";

export interface ICandidateTestLoginUsecase {
    execute(request: CandidateTestLoginInputDTO): Promise<CandidateTestLoginOutputDTO>
}