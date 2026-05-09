import { CanadidateRunCodeOutputDTO, CandidateRunCodeInputDTO } from "../../dtos/test/candidate.runCode.dto";

export interface ICandidateRunCodeUsecase {
    execute(request: CandidateRunCodeInputDTO): Promise<CanadidateRunCodeOutputDTO>
}