import { CandidateStartTestInputDTO, CandidateStartTestOutputDTO } from "../../dtos/test/candidate.startTest.dto";

export interface ICandidateStartTestUsecase {
    execute(request: CandidateStartTestInputDTO): Promise<CandidateStartTestOutputDTO>
}