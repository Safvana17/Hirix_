import { Request, Response } from "express";
import { IAdminRevenueSummeryUsecase } from "../../../../Application/admin/interfaces/analytics/IAdmin.revenueSummery.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class AdminAnalyticsController {
    constructor (
        private _getRevenueSummery: IAdminRevenueSummeryUsecase,
    ) {}

    getRevenueSummery = asyncHandler(async(req: Request, res: Response) => {
        const { totalRevenue, activeSubscribers, monthlyRevenue, averageRevenuePerUser } = await this._getRevenueSummery.execute()
        return sendSuccess(res, statusCode.OK, '', {totalRevenue, monthlyRevenue, activeSubscribers, averageRevenuePerUser})
    })
}