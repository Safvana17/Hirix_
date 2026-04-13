import { SubscriptionStatus } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminUpdateSubscriptionPlanStatusInputDTO, AdminUpdateSubscriptionPlanStatusOutputDTO } from "../../dtos/subscriptionPlan/updateStatus.subscriptionPlan.dto";
import { IAdminUpdateSubscriptionPlanStatusUsecase } from "../../interfaces/subscriptionPlan/ISubscriptionPlan.admin.updateStatus.usecase";

export class AdminUpdateSubscriptionPlanStausUsecase implements IAdminUpdateSubscriptionPlanStatusUsecase {
    constructor(
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: AdminUpdateSubscriptionPlanStatusInputDTO): Promise<AdminUpdateSubscriptionPlanStatusOutputDTO> {
        const plan = await this._subscriptionPlanRepository.findById(request.id)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(plan.planName.toLowerCase() === 'free' && request.status === SubscriptionStatus.INACTIVE){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_DEACTIVATE_FREE_PLAN, statusCode.BAD_REQUEST)
        }
        const isActive = request.status === SubscriptionStatus.ACTIVE
        plan.isActive = isActive
        await this._subscriptionPlanRepository.update(plan.id, plan)

        return { success: true }
    }
}