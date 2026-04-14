import { Request, Response } from "express";
import { ICompanyGetAllPlanUsecase } from "../../../../Application/company/interfaces/subscription/ICompanyGetAllPlanUsecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { UserPlanQuerySchema } from "../../validators/subscriptionValidators";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";

export class CompanySubscriptionController {
    constructor (
        private _getAllPlans: ICompanyGetAllPlanUsecase
    ) {}

    getAllPlan = asyncHandler(async (req: Request, res: Response) => {
        const parsed = UserPlanQuerySchema.parse(req.query)
        const subscriptionPlans = await this._getAllPlans.execute(parsed)
        logger.info(subscriptionPlans, 'from controller')
        return sendSuccess(res, statusCode.OK, '', subscriptionPlans)
    })
}