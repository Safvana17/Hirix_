import { Request, Response } from "express";
import { ICandidateDashboardSummeryUsecase } from "../../../../Application/candidate/interfaces/analytics/ICandidate.dashboardSummery.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class CandidateAnalyticsController {
    constructor (
        private _dashboardSummery: ICandidateDashboardSummeryUsecase,
    ) {}

    getSummery = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id 
        const summery = await this._dashboardSummery.execute({candidateId})
        return sendSuccess(res, statusCode.OK, '', summery.summery)
    })
}