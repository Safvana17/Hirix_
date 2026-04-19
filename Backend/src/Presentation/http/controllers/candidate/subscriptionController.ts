import { Request, Response } from "express";
import { ICandidateGetAllPlansUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getAllPlans.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { UserPlanQuerySchema } from "../../validators/subscriptionValidators";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICandidateGetCurrentPlanUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getCurrentPlan.usecase";
import { ICandidateChangeSubscriptionUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.changeSubscription.usecase";
import { ICandidateMakePaymentUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.makePayment.usecase";

export class CandidateSubscriptionController {
    constructor(
        private _getAllPlans: ICandidateGetAllPlansUsecase,
        private _getCurrentPlan: ICandidateGetCurrentPlanUsecase,
        private _changeSubscription: ICandidateChangeSubscriptionUsecase,
        private _makePayment: ICandidateMakePaymentUsecase,
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

    changePlan = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const changedPlan = await this._changeSubscription.execute({candidateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', changedPlan)
    })

    makePayment = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const result = await this._makePayment.execute({candidateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', result)
    })
}