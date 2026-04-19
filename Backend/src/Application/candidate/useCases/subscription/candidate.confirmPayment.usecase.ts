import { PaymentStatus } from "../../../../Domain/enums/payment";
import { subscriptionStatus } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IRazorpayService } from "../../../interface/service/IRazorpayService";
import { CandidateConfirmPaymentInputDTO, CandidateConfirmPaymentOutputDTO } from "../../dtos/subscription/candidate.confirmPayment.dto";
import { ICandidateConfirmPaymentUsecase } from "../../interfaces/subscription/ICandidate.confirmPayment.usecase";

export class CandidateConfirmPaymentUsecase implements ICandidateConfirmPaymentUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _paymentRepository: IPaymentRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _razorpayService: IRazorpayService
    ) {}

    async execute(request: CandidateConfirmPaymentInputDTO): Promise<CandidateConfirmPaymentOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
      
        const plan = await this._subscriptionPlanRepository.findById(request.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(plan.price === 0){
            throw new AppError(subscriptionPlanMessages.error.DOESNOT_REQUIRE_PAYMENT, statusCode.BAD_REQUEST)
        }

        const payment = await this._paymentRepository.findByOrderId(request.orderId)
        if(!payment){
            throw new AppError(subscriptionPlanMessages.error.PAYMENT_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isValid = await this._razorpayService.verifySignature(request.orderId, request.paymentId, request.signature)
        if(!isValid){
            throw new AppError(subscriptionPlanMessages.error.INVALID_PAYMENT_SIGNATURE, statusCode.BAD_REQUEST)
        }
        
        const currentSubscription = await this._subscriptionRepository.findCurrentByUserId(candidate.id)
        if(currentSubscription){
            currentSubscription.status = subscriptionStatus.CANCELLED
            currentSubscription.isCurrent = false
            await this._subscriptionRepository.update(currentSubscription.id, currentSubscription)
        }

        const newSubscription = await this._subscriptionRepository.findById(payment.subscriptionId)
        if(!newSubscription){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        newSubscription.status = subscriptionStatus.ACTIVE
        newSubscription.isCurrent = true
        await this._subscriptionRepository.update(newSubscription.id, newSubscription)

        payment.status = PaymentStatus.SUCCESS
        payment.paymentId = request.paymentId
        payment.signature = request.signature
        await this._paymentRepository.update(payment.id, payment)

        return { success: true }
    }
}