import { CandidateGetTestByTokenInputDTO, CandidateGetTestByTokenOutputDTO } from "../../dtos/test/candidate.getTestByToken.dto";

export interface ICandidateGetTestByTokenUsecase {
    execute(request: CandidateGetTestByTokenInputDTO): Promise<CandidateGetTestByTokenOutputDTO>
}