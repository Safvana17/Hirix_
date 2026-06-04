import { Request, Response } from "express";
import { ICompanyGetDashboardSummery } from "../../../../Application/company/interfaces/analytics/ICompany.getDashboardSummery.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICompanyTestParticipationTrendUsecase } from "../../../../Application/company/interfaces/analytics/ICompany.testParticipationTrend.usecase";
import { RecentActivityQuery, RevenueTrendByMonthQuery } from "../../validators/analyticsValidator";
import { ICompanyCandidateStatusDistributionUsecase } from "../../../../Application/company/interfaces/analytics/ICompany.candidateStatusDistribution.usecase";
import { ICompanyGetRecentActivity } from "../../../../Application/company/interfaces/analytics/ICompany.getRecentActivity.usecase";

export class CompanyAnalyticsController {
    constructor (
        private _getDashboardSummery: ICompanyGetDashboardSummery,
        private _testParticaptionTrend: ICompanyTestParticipationTrendUsecase,
        private _candidateStatusDistribution: ICompanyCandidateStatusDistributionUsecase,
        private _recentActivity: ICompanyGetRecentActivity,
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

    candidateStatusDistribution = asyncHandler( async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { month } = req.validatedQuery as RevenueTrendByMonthQuery
        const distribution = await this._candidateStatusDistribution.execute({companyId, month})
        return sendSuccess(res, statusCode.OK, '', distribution.distribution)
    })

    getRecentActivity = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { month, page, limit } = req.validatedQuery as RecentActivityQuery
        const { activities, totalCount, totalPages } = await this._recentActivity.execute({companyId, month, page, limit})
        return sendSuccess(res, statusCode.OK, '', { activities, totalCount, totalPages})
    })
}