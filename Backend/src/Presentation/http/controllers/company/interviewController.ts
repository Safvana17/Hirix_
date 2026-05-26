import { Request, Response } from "express";
import { ICompanyScheduleInterviewUsecase } from "../../../../Application/company/interfaces/interview/ICompany.scheduleInterview.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICompanyGetAllInterviewsUsecase } from "../../../../Application/company/interfaces/interview/ICompany.getAllInterview.usecase";
import { GetAllInterviewQuery } from "../../validators/interviewValidator";

export class CompanyInterviewController {
    constructor(
        private _scheduleInterview: ICompanyScheduleInterviewUsecase,
        private _getAllInterviews: ICompanyGetAllInterviewsUsecase,
    ) {}

    scheduleInterview = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const {interview} = await this._scheduleInterview.execute({companyId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', interview)
    })

    getAllInterviews = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const query = req.validatedQuery as GetAllInterviewQuery
        const {interviews, totalCount, totalPages} = await this._getAllInterviews.execute({companyId, ...query})
        return sendSuccess(res, statusCode.OK, '', { interviews, totalCount, totalPages })
    })
}