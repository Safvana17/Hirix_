import { Request, Response } from "express";
import { IAdminRevenueSummeryUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.revenueSummery.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminGetRevenueTrendByMonthUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.getRevenueTrendByMonth.usecase";
import { RevenueTrendByMonthQuery } from "../../validators/analyticsValidator";

export class AdminAnalyticsController {
    constructor (
        private _getRevenueSummery: IAdminRevenueSummeryUsecase,
        private _getRevenueTrendByMonth: IAdminGetRevenueTrendByMonthUsecase,
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
}