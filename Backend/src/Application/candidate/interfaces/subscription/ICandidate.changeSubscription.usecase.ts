import { CandidateChangeSubscriptionInputDTO, CandidateChangeSubscriptionOutputDTO } from "../../dtos/subscription/candidate.changeSubscription.dto";

export interface ICandidateChangeSubscriptionUsecase {
    execute(request: CandidateChangeSubscriptionInputDTO): Promise<CandidateChangeSubscriptionOutputDTO>
}