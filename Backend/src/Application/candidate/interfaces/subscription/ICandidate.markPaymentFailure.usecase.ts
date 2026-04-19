import { CandidatePaymentFailureInputDTO, CandidatePaymentFailureOutputDTO } from "../../dtos/subscription/candidate.markFailurePayment.dto";

export interface ICandidateMarkPaymentFailureUsecase {
    execute(request: CandidatePaymentFailureInputDTO): Promise<CandidatePaymentFailureOutputDTO>
}