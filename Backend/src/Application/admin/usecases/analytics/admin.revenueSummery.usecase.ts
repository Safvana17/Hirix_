import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { AdminRevenueSummeryOutputDTO } from "../../dtos/analytics/admin.revenueSummery.dto";
import { IAdminRevenueSummeryUsecase } from "../../interfaces/analytics/IAdmin.revenueSummery.usecase";

export class AdminRevenueSummeryUsecase implements IAdminRevenueSummeryUsecase {
    constructor (
        private _paymentRepository: IPaymentRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) {}

    async execute(): Promise<AdminRevenueSummeryOutputDTO> {
        const totalRevenue = await this._paymentRepository.getTotalRevenue()
        const monthlyRevenue = await this._paymentRepository.getMonthlyRevenue()
        const totalActiveSubscribers = await this._subscriptionRepository.getActiveSubscribers()
        const totalSubscribers = await this._subscriptionRepository.getTotalSubscribers()

        const averageRevenuePerUser = totalSubscribers > 0
                  ? Math.floor(totalRevenue / totalSubscribers)
                  : 0
        return {
            totalRevenue,
            monthlyRevenue,
            activeSubscribers: totalActiveSubscribers,
            averageRevenuePerUser
        }
    }
}