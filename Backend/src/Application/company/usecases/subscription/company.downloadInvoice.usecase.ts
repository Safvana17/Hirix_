import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IPdfService } from "../../../interface/service/IPdfService";
import { CompanyDownloadInvoiceInputDTO, CompanyDownloadInvoiceOutputDTO } from "../../dtos/subscription/company.downloadInvoice.dto";
import { ICompanyDownloadInvoiceUsecase } from "../../interfaces/subscription/ICompany.downloadInvoice.usecase";

export class CompanyDownloadInvoiceUsecase implements ICompanyDownloadInvoiceUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _paymentRepository: IPaymentRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _pdfService: IPdfService
    ) {}

    async execute(request: CompanyDownloadInvoiceInputDTO): Promise<CompanyDownloadInvoiceOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const subscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const payment = await this._paymentRepository.findById(request.paymentId)
        if(!payment){
            throw new AppError(subscriptionPlanMessages.error.PAYMENT_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(payment.ownerId !== request.companyId){
            throw new AppError(authMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }

        const plan = await this._subscriptionPlanRepository.findById(payment.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        const pdfBuffer = await this._pdfService.generateInvoice({user: company, payment, subscriptionPlan: plan, subscription})
        
        return {
            fileName: `invoice-${payment.id}.pdf`,
            mimeType: 'application/pdf',
            buffer: pdfBuffer
        }

    }
}