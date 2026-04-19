import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IPdfService } from "../../../interface/service/IPdfService";
import { CandidateDownloadInvoiceInputDTO, CandidateDownloadInvoiceOutputDTO } from "../../dtos/subscription/candidate.getInvoice.dto";
import { ICandidateGetInvoiceUsecase } from "../../interfaces/subscription/ICandidate.getInvoice.usecase";

export class CandidateGetInvoiceUsecase implements ICandidateGetInvoiceUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _paymentRepository: IPaymentRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _pdfService: IPdfService
    ) {}

    async execute(request: CandidateDownloadInvoiceInputDTO): Promise<CandidateDownloadInvoiceOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const subscription = await this._subscriptionRepository.findCurrentByUserId(candidate.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const payment = await this._paymentRepository.findById(request.paymentId)
        if(!payment){
            throw new AppError(subscriptionPlanMessages.error.PAYMENT_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(payment.ownerId !== request.candidateId){
            throw new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }

        const plan = await this._subscriptionPlanRepository.findById(payment.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        const pdfBuffer = await this._pdfService.generateInvoice({user: candidate, payment, subscriptionPlan: plan, subscription})
        
        return {
            fileName: `invoice-${payment.id}.pdf`,
            mimeType: 'application/pdf',
            buffer: pdfBuffer
        }       
    }
}