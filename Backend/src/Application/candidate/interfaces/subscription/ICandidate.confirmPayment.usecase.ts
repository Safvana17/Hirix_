import { CandidateConfirmPaymentInputDTO, CandidateConfirmPaymentOutputDTO } from "../../dtos/subscription/candidate.confirmPayment.dto";

export interface ICandidateConfirmPaymentUsecase {
    execute(request: CandidateConfirmPaymentInputDTO): Promise<CandidateConfirmPaymentOutputDTO>
}