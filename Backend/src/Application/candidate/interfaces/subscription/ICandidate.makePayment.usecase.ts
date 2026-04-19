import { CandidateMakePaymentInputDTO, CandidateMakePaymentOutputDTO } from "../../dtos/subscription/candidate.makePayment.dto";

export interface ICandidateMakePaymentUsecase {
    execute(request: CandidateMakePaymentInputDTO): Promise<CandidateMakePaymentOutputDTO>
}