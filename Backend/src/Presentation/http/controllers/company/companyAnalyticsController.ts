import { Request, Response } from "express";
import { ICompanyGetDashboardSummery } from "../../../../Application/company/interfaces/analytics/ICompany.getDashboardSummery.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class CompanyAnalyticsController {
    constructor (
        private _getDashboardSummery: ICompanyGetDashboardSummery,
    ) {}

    dashboardSummery = asyncHandler( async(req: Request, res: Response) => {
        const companyId = req.user.id 
        const { totalTests, totalInterviews, hiredCandidates, currentPlan } = await this._getDashboardSummery.execute({companyId})
        return sendSuccess(res, statusCode.OK, '', { totalTests, totalInterviews, hiredCandidates, currentPlan})
    })
}