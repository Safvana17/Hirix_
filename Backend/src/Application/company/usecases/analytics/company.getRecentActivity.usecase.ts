import { IActivityLogRepository } from "../../../../Domain/repositoryInterface/IActivityLog.repository";
import { CompanyGetRecentActivityInputDTO, CompanyGetRecentActivityOutputDTO } from "../../dtos/analytics/company.getRecentActivity.dto";
import { ICompanyGetRecentActivity } from "../../interfaces/analytics/ICompany.getRecentActivity.usecase";

export class CompanyGetRecentActivityUsecase implements ICompanyGetRecentActivity {
    constructor(
        private _activityLogRepository: IActivityLogRepository
    ) {}

    async execute(request: CompanyGetRecentActivityInputDTO): Promise<CompanyGetRecentActivityOutputDTO> {
        const startDate = new Date()
        startDate.setMonth( startDate.getMonth() - (request.month - 1))
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        const { logs, totalPages, totalCount } = await this._activityLogRepository.findAllFiltered({startDate: startDate, userId: request.companyId, page: request.page, limit: request.limit})
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