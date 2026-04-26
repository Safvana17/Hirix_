import { PaymentEntity } from "../../../../Domain/entities/Payment.entity";
import { SubscriptionEntity } from "../../../../Domain/entities/Subscription.entity";
import { PaymentStatus } from "../../../../Domain/enums/payment";
import { subscriptionStatus, TargetType } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IRazorpayService } from "../../../interface/service/IRazorpayService";
import { ComapnyMakePaymentInputDTO, ComapnyMakePaymentOutputDTO } from "../../dtos/subscription/company.makePayment.dto";
import { ICompanyMakePaymentUsecase } from "../../interfaces/subscription/ICompany.makePayment.usecase";

export class CompanyMakePaymentUsecase implements ICompanyMakePaymentUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _razorpayService: IRazorpayService,
        private _subscriptionRepository: ISubscriptionRepository,
        private _paymentRepository: IPaymentRepository
    ) {}

    async execute(request: ComapnyMakePaymentInputDTO): Promise<ComapnyMakePaymentOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const newPlan = await this._subscriptionPlanRepository.findById(request.planId)
        if(!newPlan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(newPlan.price === 0){
            throw new AppError(subscriptionPlanMessages.error.DOESNOT_REQUIRE_PAYMENT, statusCode.BAD_REQUEST)
        }

        const startDate = new Date()
        const endDate = newPlan.durationDays 
            ? new Date(startDate.getTime() + newPlan.durationDays * 24 * 60 * 60 * 1000)
            : null

        const newSubscription = new SubscriptionEntity(
            '',
            TargetType.COMPANY,
            company.id,
            newPlan.id,
            startDate,
            endDate,
            subscriptionStatus.PENDING,
            false,
            false
        )
        const subscription = await this._subscriptionRepository.create(newSubscription)
        const order = await this._razorpayService.createOrder(newPlan.price, "INR", `sub_${subscription.id}` )

        const payment = new PaymentEntity(
            '',
            subscription.id,
            subscription.ownerType,
            subscription.ownerId,
            newPlan.id,
            newPlan.price,
            "INR",
            PaymentStatus.PENDING,
            order.orderId,
            '',
            '',
            `Subscription for ${newPlan.planName}`,
            '',
            new Date()
        )

        await this._paymentRepository.create(payment)
        return {
            orderId: order.orderId,
            amount: order.amount,
            currency: order.currency
        }

    }
}