import { NotificationEvents } from "../../../../Domain/enums/notification";
import { PaymentStatus } from "../../../../Domain/enums/payment";
import { subscriptionStatus } from "../../../../Domain/enums/subscription";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { CompanyPaymentFailureInputDTO, CompanyPaymentFailureOutputDTO } from "../../dtos/subscription/company.paymentFailure.dto";
import { ICompanyPaymentFailureUsecase } from "../../interfaces/subscription/ICompany.paymentFailure.usecase";

export class CompanyPaymentFailureUsecase implements ICompanyPaymentFailureUsecase{
   constructor(
       private _companyRepository: ICompanyRepository,
       private _paymentRepository: IPaymentRepository,
       private _subscriptionRepository: ISubscriptionRepository,
       private _processNotification: IAdminProcessNotificationUsecase
    ) {}

    async execute(request: CompanyPaymentFailureInputDTO): Promise<CompanyPaymentFailureOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
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
        await this._processNotification.execute({
            event: NotificationEvents.PAYMENT_FAILED,
            recipients: [{
                recipientType: userRole.Company,
                recipientId: company.id
            }],
          variables: {}
        })
        return {
            success: true
        }
    }

}