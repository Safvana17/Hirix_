import { CandidateTestHistoryInputDTO, CandidateTestHistoryOutputDTO } from "../../dtos/analytics/candidate.testHistory.dto";

export interface ICandidateTestHistoryUsecase {
    execute(request: CandidateTestHistoryInputDTO): Promise<CandidateTestHistoryOutputDTO>
}