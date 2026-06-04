import { IActivityLogRepository } from "../../../../Domain/repositoryInterface/IActivityLog.repository";
import { AdminGetRecentActivityInputDTO, AdminGetRecentActivityOutputDTO } from "../../dtos/analytics/admin.recentActivity.dto";
import { IAdminRecentActivityUsecase } from "../../interfaces/analytics/IAdmin.recentActivity.usecase";

export class AdminGetRecentActivityUsecase implements IAdminRecentActivityUsecase {
    constructor(
        private _activityLOgRepository: IActivityLogRepository,
    ) {}

    async execute(request: AdminGetRecentActivityInputDTO): Promise<AdminGetRecentActivityOutputDTO> {
        const startDate = new Date()
        startDate.setMonth( startDate.getMonth() - (request.month - 1))
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        const { logs, totalPages, totalCount } = await this._activityLOgRepository.findAllFiltered({startDate: startDate, page: request.page, limit: request.limit})
        return {
            activities: logs.map(d => ({
                date: d.createdAt?.toISOString() ?? '',
                title: d.title,
                targetType: d.targetType,
                role: d.actorType,
                action: d.action
            })),
            totalCount,
            totalPages
        }
    }
}