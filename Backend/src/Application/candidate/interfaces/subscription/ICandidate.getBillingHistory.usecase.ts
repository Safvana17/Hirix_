import { CandidateGetBillingHistoryInputDTO, CandidateGetBillingHistoryOutputDTO } from "../../dtos/subscription/candidate.getBillingHistory.dto";

export interface ICandidateGetBillingHistoryUsecase {
    execute(request: CandidateGetBillingHistoryInputDTO): Promise<CandidateGetBillingHistoryOutputDTO>
}