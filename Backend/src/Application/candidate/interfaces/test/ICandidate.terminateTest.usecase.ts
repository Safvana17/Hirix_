import { CandidateTerminateTestInputDTO, CandidateTerminateTestOutputDTO } from "../../dtos/test/candidate.terminateTest.dto";

export interface ICandidateTerminateTestUsecase {
    execute(request: CandidateTerminateTestInputDTO): Promise<CandidateTerminateTestOutputDTO>
}