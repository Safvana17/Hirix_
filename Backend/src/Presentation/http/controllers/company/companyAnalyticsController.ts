import { Request, Response } from "express";
import { ICompanyGetDashboardSummery } from "../../../../Application/company/interfaces/analytics/ICompany.getDashboardSummery.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICompanyTestParticipationTrendUsecase } from "../../../../Application/company/interfaces/analytics/ICompany.testParticipationTrend.usecase";
import { RevenueTrendByMonthQuery } from "../../validators/analyticsValidator";

export class CompanyAnalyticsController {
    constructor (
        private _getDashboardSummery: ICompanyGetDashboardSummery,
        private _testParticaptionTrend: ICompanyTestParticipationTrendUsecase,
    ) {}

    dashboardSummery = asyncHandler( async(req: Request, res: Response) => {
        const companyId = req.user.id 
        const { totalTests, totalInterviews, hiredCandidates, currentPlan } = await this._getDashboardSummery.execute({companyId})
        return sendSuccess(res, statusCode.OK, '', { totalTests, totalInterviews, hiredCandidates, currentPlan})
    })

    testParticipationTrend = asyncHandler( async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { month } = req.validatedQuery as RevenueTrendByMonthQuery
        const trend = await this._testParticaptionTrend.execute({companyId, month})
        return sendSuccess(res, statusCode.OK, '', trend.trend)
    })
}