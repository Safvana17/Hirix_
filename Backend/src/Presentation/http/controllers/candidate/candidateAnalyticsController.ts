import { Request, Response } from "express";
import { ICandidateDashboardSummeryUsecase } from "../../../../Application/candidate/interfaces/analytics/ICandidate.dashboardSummery.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICandidateTestHistoryUsecase } from "../../../../Application/candidate/interfaces/analytics/ICandidate.testHistory.usecase";
import { PaymentHistoryQuery } from "../../validators/analyticsValidator";

export class CandidateAnalyticsController {
    constructor (
        private _dashboardSummery: ICandidateDashboardSummeryUsecase,
        private _testHistory: ICandidateTestHistoryUsecase,
    ) {}

    getSummery = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id 
        const summery = await this._dashboardSummery.execute({candidateId})
        return sendSuccess(res, statusCode.OK, '', summery.summery)
    })

    testHistory = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const query = req.validatedQuery as PaymentHistoryQuery
        const { history, totalPages, totalCount } = await this._testHistory.execute({candidateId, ...query})
        return sendSuccess(res, statusCode.OK, '', { history, totalCount, totalPages })
    })
}