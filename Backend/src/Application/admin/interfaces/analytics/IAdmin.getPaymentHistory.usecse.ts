import { AdminGetPaymentHistoryInputDTO, AdminGetPaymentHistoryOutputDTO } from "../../dtos/analytics/admin.getPaymentHistory.dto";

export interface IAdminGetPaymentHistoryUsecase {
    execute(request: AdminGetPaymentHistoryInputDTO): Promise<AdminGetPaymentHistoryOutputDTO>
}