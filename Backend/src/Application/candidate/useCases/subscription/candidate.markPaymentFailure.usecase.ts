import { PaymentStatus } from "../../../../Domain/enums/payment";
import { subscriptionStatus } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidatePaymentFailureInputDTO, CandidatePaymentFailureOutputDTO } from "../../dtos/subscription/candidate.markFailurePayment.dto";
import { ICandidateMarkPaymentFailureUsecase } from "../../interfaces/subscription/ICandidate.markPaymentFailure.usecase";

export class CandidateMarkPaymentFailureUsecase implements ICandidateMarkPaymentFailureUsecase {
    constructor(
       private _coandidateRepository: ICandidateRepository,
       private _paymentRepository: IPaymentRepository,
       private _subscriptionRepository: ISubscriptionRepository
    ) {}

    async execute(request: CandidatePaymentFailureInputDTO): Promise<CandidatePaymentFailureOutputDTO> {
        const candidate = await this._coandidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const payment = await this._paymentRepository.findByOrderId(request.orderId)
        if(!payment){
            throw new AppError(subscriptionPlanMessages.error.PAYMENT_NOT_FOUND, statusCode.NOT_FOUND)
        }
        payment.status = PaymentStatus.FAILED
        await this._paymentRepository.update(payment.id, payment)

        const subscription = await this._subscriptionRepository.findById(payment.subscriptionId)
        if(subscription){
            subscription.status = subscriptionStatus.CANCELLED
            subscription.isCurrent = false
            await this._subscriptionRepository.update(subscription.id, subscription)
        }
        return {
            success: true
        }
    }
}