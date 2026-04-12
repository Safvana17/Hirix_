import { NextFunction, Request, Response } from "express";
import { ICreateSubscriptionPlanUsecase } from "../../../../Application/admin/interfaces/subscriptionPlan/ISubscriptionPlan.admin.create.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";

export class SubscriptionPlanController {
    constructor (
        private _createSubcriptionPlan: ICreateSubscriptionPlanUsecase
    ) {}

    createPlan = asyncHandler( async(req: Request, res: Response) => {
        const plan = await this._createSubcriptionPlan.execute(req.body)
        sendSuccess(res, statusCode.OK, subscriptionPlanMessages.success.PLAN_CREATED, plan)
    })
}