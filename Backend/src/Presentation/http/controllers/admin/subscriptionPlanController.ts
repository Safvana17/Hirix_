import { NextFunction, Request, Response } from "express";
import { ICreateSubscriptionPlanUsecase } from "../../../../Application/admin/interfaces/subscriptionPlan/ISubscriptionPlan.admin.create.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { PlanQuerySchema } from "../../validators/subscriptionPlanValidator";
import { IAdminGetAllSubscriptionPlanUsecase } from "../../../../Application/admin/interfaces/subscriptionPlan/ISubscriptionPlan.admin.getAll.usecase";
import { logger } from "../../../../utils/logging/loger";

export class SubscriptionPlanController {
    constructor (
        private _createSubcriptionPlan: ICreateSubscriptionPlanUsecase,
        private _getAllSubscriptionPlans: IAdminGetAllSubscriptionPlanUsecase
    ) {}

    createPlan = asyncHandler( async(req: Request, res: Response) => {
        const plan = await this._createSubcriptionPlan.execute(req.body)
        return sendSuccess(res, statusCode.OK, subscriptionPlanMessages.success.PLAN_CREATED, plan)
    })

    getAllPlans = asyncHandler(async(req: Request, res: Response) => {
        const parsed = PlanQuerySchema.parse(req.query)
        const subscriptionPlans = await this._getAllSubscriptionPlans.execute(parsed)
        logger.info(subscriptionPlans)
        return sendSuccess(res, statusCode.OK, '', subscriptionPlans)
    })
}