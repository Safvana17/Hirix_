import { CandidateCancelSubscriptionInputDTO, CandidateCancelSubscriptionOutputDTO } from "../../dtos/subscription/candidate.cancelSubscription.dto";

export interface ICandidateCancelSubscriptionUsecase {
    execute(request: CandidateCancelSubscriptionInputDTO): Promise<CandidateCancelSubscriptionOutputDTO>
}