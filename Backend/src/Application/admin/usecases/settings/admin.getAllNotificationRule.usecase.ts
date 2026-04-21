import { INotificationRuleRepository } from "../../../../Domain/repositoryInterface/iNotificationRule.repository";
import { AdminGetAllNotificationRuleOutputDTO } from "../../dtos/settings/admin.getAllNotificationRule.dto";
import { IAdminGetAllNotificationRuleUsecase } from "../../interfaces/settings/IAdmin.getAllNotificationRule";

export class AdminGetAllNotificationRuleUsecase implements IAdminGetAllNotificationRuleUsecase{
    constructor(
        private _notificationRuleRepository: INotificationRuleRepository
    ) {}

    async execute(): Promise<AdminGetAllNotificationRuleOutputDTO> {
        const rules = await this._notificationRuleRepository.findAll()
        return {
            rules
        }
    }
}