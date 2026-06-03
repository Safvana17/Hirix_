import { Request, Response } from "express";
import { IAdminRevenueSummeryUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.revenueSummery.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminGetRevenueTrendByMonthUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.getRevenueTrendByMonth.usecase";
import { PaymentHistoryQuery, RevenueTrendByMonthQuery, RevenueTrendByPlanQuery } from "../../validators/analyticsValidator";
import { IAdminGetRevenueTrendByPlanUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.getRevenueTrendByPlan.usecase";
import { logger } from "../../../../utils/logging/loger";
import { IAdminGetPaymentHistoryUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.getPaymentHistory.usecse";
import { IAdminGetDashboardSummeryUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.dashboardSummery.usecase";
import { IAdminGetTestActivityUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.testActivity.usecase";
import { IAdminSubscriptionDistributionUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.subscriptionDistribution.usecase";
import { IAdminTestLogUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.testLog.usecase";

export class AdminAnalyticsController {
    constructor (
        private _getRevenueSummery: IAdminRevenueSummeryUsecase,
        private _getRevenueTrendByMonth: IAdminGetRevenueTrendByMonthUsecase,
        private _getRevenueTrendByPlan: IAdminGetRevenueTrendByPlanUsecase,
        private _getPaymentHistory: IAdminGetPaymentHistoryUsecase,
        private _getAdminDashboardSummery: IAdminGetDashboardSummeryUsecase,
        private _testActivity: IAdminGetTestActivityUsecase,
        private _subscriptionDistribution: IAdminSubscriptionDistributionUsecase,
        private _testLog: IAdminTestLogUsecase,
    ) {}

    getRevenueSummery = asyncHandler(async(req: Request, res: Response) => {
        const { totalRevenue, activeSubscribers, monthlyRevenue, averageRevenuePerUser } = await this._getRevenueSummery.execute()
        return sendSuccess(res, statusCode.OK, '', {totalRevenue, monthlyRevenue, activeSubscribers, averageRevenuePerUser})
    })

    getReveneueTrendByMonth = asyncHandler(async(req: Request, res: Response) => {
        const { month } = req.validatedQuery as RevenueTrendByMonthQuery
        const trend = await this._getRevenueTrendByMonth.execute({month})
        return sendSuccess(res, statusCode.OK, '', trend.trend)
    })

    getReveneueTrendByPlan = asyncHandler(async(req: Request, res: Response) => {
        const { type } = req.validatedQuery as RevenueTrendByPlanQuery
        const trend = await this._getRevenueTrendByPlan.execute({type})
        logger.info({trend: trend}, 'from controller')
        return sendSuccess(res, statusCode.OK, '', trend.trend)
    })

    getPaymentHistory = asyncHandler(async(req: Request, res: Response) => {
        const query = req.validatedQuery as PaymentHistoryQuery
        const { history, totalCount, totalPages} = await this._getPaymentHistory.execute({...query})
        return sendSuccess(res, statusCode.OK, '', {history, totalCount, totalPages})
    })

    adminDashboardSummery = asyncHandler(async(req: Request, res: Response) => {
        const { totalRevenue, totalCandidates, totalCompanies, totalQuestions, totalTests } = await this._getAdminDashboardSummery.execute()
        return sendSuccess(res, statusCode.OK, '', {totalCompanies, totalCandidates, totalQuestions, totalTests, totalRevenue})
    })
    getTestActivity = asyncHandler(async(req: Request, res: Response) => {
        const { month } = req.validatedQuery as RevenueTrendByMonthQuery
        const activity = await this._testActivity.execute({month})
        return sendSuccess(res, statusCode.OK, '', activity.activity)
    })

    getSubscriptionDistribution = asyncHandler(async(req: Request, res: Response) => {
        const { type } = req.validatedQuery as RevenueTrendByPlanQuery
        const distribution = await this._subscriptionDistribution.execute({type})
        return sendSuccess(res, statusCode.OK, '', distribution.distribution)
    })

    getTestLog = asyncHandler(async(req: Request, res: Response) => {
        const query = req.validatedQuery as PaymentHistoryQuery
        const { test, totalCount, totalPages} = await this._testLog.execute({...query})
        return sendSuccess(res, statusCode.OK, '', {test, totalCount, totalPages})
    })
}