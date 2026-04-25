import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { AdminGetAllNotificationRuleInputDTO, AdminGetAllNotificationRuleOutputDTO } from "../../dtos/settings/admin.getAllNotificationRule.dto";
import { IAdminGetAllNotificationRuleUsecase } from "../../interfaces/settings/IAdmin.getAllNotificationRule";

export class AdminGetAllNotificationRuleUsecase implements IAdminGetAllNotificationRuleUsecase{
    constructor(
        private _notificationRuleRepository: INotificationRuleRepository
    ) {}

    async execute(request: AdminGetAllNotificationRuleInputDTO): Promise<AdminGetAllNotificationRuleOutputDTO> {
        const { data, totalCount, totalPages }= await this._notificationRuleRepository.findAllFiltered(request)
        return {
            rules: data,
            totalCount,
            totalPages
        }
    }
}