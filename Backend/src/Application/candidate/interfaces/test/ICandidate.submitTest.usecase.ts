import { CandidateSubmitTestInputDTO, CandidateSubmitTestOutputDTO } from "../../dtos/test/candidate.submitTest.dto";

export interface ICandidateSubmitTestUsecase {
    execute(request: CandidateSubmitTestInputDTO): Promise<CandidateSubmitTestOutputDTO>
}