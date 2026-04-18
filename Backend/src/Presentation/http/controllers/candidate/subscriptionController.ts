import { Request, Response } from "express";
import { ICandidateGetAllPlansUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getAllPlans.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { UserPlanQuerySchema } from "../../validators/subscriptionValidators";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class CandidateSubscriptionController {
    constructor(
        private _getAllPlans: ICandidateGetAllPlansUsecase
    ) {}

    getAllPlan = asyncHandler(async (req: Request, res: Response) => {
        const parsed = UserPlanQuerySchema.parse(req.query)
        const subscriptionPlans = await this._getAllPlans.execute(parsed)
        return sendSuccess(res, statusCode.OK, '', subscriptionPlans)
    })
}