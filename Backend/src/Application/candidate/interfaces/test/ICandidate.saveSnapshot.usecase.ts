import { CandidateSaveSnapshotInputDTO, CandidateSaveSnapshotOutputDTO } from "../../dtos/test/candidate.saveSnapshot.dto";

export interface ICandidateSaveSnapshotUsecase {
    execute(request: CandidateSaveSnapshotInputDTO): Promise<CandidateSaveSnapshotOutputDTO>
}