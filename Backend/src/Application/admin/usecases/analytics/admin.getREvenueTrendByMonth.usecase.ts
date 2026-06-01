import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { AdminGetRevenueTrendByMonthInputDTO, AdminGetRevenueTrendByMonthOutputDTO } from "../../dtos/analytics/admin.revenueTrendByMonth.dto";
import { IAdminGetRevenueTrendByMonthUsecase } from "../../interfaces/analytics/IAdmin.getRevenueTrendByMonth.usecase";

export class AdminGetRevenueTrendByMonthUsecase implements IAdminGetRevenueTrendByMonthUsecase {
    constructor (
        private _paymentRepository: IPaymentRepository
    ) {}

    async execute(request: AdminGetRevenueTrendByMonthInputDTO): Promise<AdminGetRevenueTrendByMonthOutputDTO> {
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - (request.month - 1))
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)

        const trend = await this._paymentRepository.getRevenueTrendByMonth(startDate)
        return {
            trend
        }
    }
}