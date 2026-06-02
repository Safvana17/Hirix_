import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { logger } from "../../../../utils/logging/loger";
import { AdminGetRevenueTrendByPlanInputDTO, AdminGetRevenueTrendByPlanOutputDTO } from "../../dtos/analytics/admin.revenueTrendByPlan.dto";
import { IAdminGetRevenueTrendByPlanUsecase } from "../../interfaces/analytics/IAdmin.getRevenueTrendByPlan.usecase";

export class AdminGetRevenueTrendByPlanUsecase implements IAdminGetRevenueTrendByPlanUsecase {
    constructor (
        private _paymentREpository: IPaymentRepository
    ) {}

    async execute(request: AdminGetRevenueTrendByPlanInputDTO): Promise<AdminGetRevenueTrendByPlanOutputDTO> {
        const trend = await this._paymentREpository.getRevenueTrendByPlan(request.type)
        logger.info(trend, 'from usecase')
        return {
            trend
        }
    }
}