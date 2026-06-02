import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { logger } from "../../../../utils/logging/loger";
import { AdminGetPaymentHistoryInputDTO, AdminGetPaymentHistoryOutputDTO } from "../../dtos/analytics/admin.getPaymentHistory.dto";
import { IAdminGetPaymentHistoryUsecase } from "../../interfaces/analytics/IAdmin.getPaymentHistory.usecse";

export class AdminGetPaymentHistoryUsecase implements IAdminGetPaymentHistoryUsecase {
    constructor (
        private _paymentRepository: IPaymentRepository
    ) {}

    async execute(request: AdminGetPaymentHistoryInputDTO): Promise<AdminGetPaymentHistoryOutputDTO> {
        const { data, totalPages, totalCount } = await this._paymentRepository.getHistory(request)
        logger.info(data, 'from history')
        return {
           history: data.map((payment) => ({
            id: payment.id,
            name: payment.name,
            plan: payment.plan,
            amount: payment.amount,
            date: new Date(payment.date).toLocaleString(),
            target: payment.target,
            status: payment.status
           })),
           totalCount,
           totalPages
        }
    }
}