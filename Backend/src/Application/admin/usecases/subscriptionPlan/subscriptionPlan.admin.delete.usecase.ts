import { AppError } from "../../../../Domain/errors/app.error";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminDeleteSubscriptionPlanInputDTO, AdminDeleteSubscriptionPlanOutputDTO } from "../../dtos/subscriptionPlan/delete.subscriptionPlan.dto";
import { IAdminDeleteSubscriptionPlanUsecase } from "../../interfaces/subscriptionPlan/ISubscriptionPlan.admin.delete.usecase";

export class AdminDeleteSubscriptionPlanUsecase implements IAdminDeleteSubscriptionPlanUsecase {
    constructor(
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: AdminDeleteSubscriptionPlanInputDTO): Promise<AdminDeleteSubscriptionPlanOutputDTO> {
        const plan = await this._subscriptionPlanRepository.findById(request.id)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(plan.isDeleted){
            throw new AppError(subscriptionPlanMessages.error.ALREADY_DELETED, statusCode.BAD_REQUEST)
        }
        if(plan.isActive){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_DELETE_ACTIVE_PLAN, statusCode.BAD_REQUEST)
        }

        plan.isDeleted = true
        await this._subscriptionPlanRepository.update(plan.id, plan)

        return {
            success: true
        }
    }
}