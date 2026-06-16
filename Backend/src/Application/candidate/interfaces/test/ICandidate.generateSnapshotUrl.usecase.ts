import { CandidateGenerateSnapshotUrlInputDTO, CandidateGenerateSnapshotUrlOutputDTO } from "../../dtos/test/candidate.generateSnapshotUploadUrl.dto";

export interface ICandidateGenereateSnapshotUrlUsecase {
    execute(request: CandidateGenerateSnapshotUrlInputDTO): Promise<CandidateGenerateSnapshotUrlOutputDTO>
}