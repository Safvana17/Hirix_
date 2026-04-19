import { Request, Response } from "express";
import { ICandidateGetAllPlansUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getAllPlans.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { UserPlanQuerySchema } from "../../validators/subscriptionValidators";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICandidateGetCurrentPlanUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getCurrentPlan.usecase";

export class CandidateSubscriptionController {
    constructor(
        private _getAllPlans: ICandidateGetAllPlansUsecase,
        private _getCurrentPlan: ICandidateGetCurrentPlanUsecase,
    ) {}

    getAllPlan = asyncHandler(async (req: Request, res: Response) => {
        const parsed = UserPlanQuerySchema.parse(req.query)
        const subscriptionPlans = await this._getAllPlans.execute(parsed)
        return sendSuccess(res, statusCode.OK, '', subscriptionPlans)
    })

    getCurrentPlan = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const currentPlan = await this._getCurrentPlan.execute({id: candidateId})
        return sendSuccess(res, statusCode.OK, '', currentPlan)
    })
}