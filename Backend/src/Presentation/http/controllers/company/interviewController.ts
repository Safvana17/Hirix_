import { Request, Response } from "express";
import { ICompanyScheduleInterviewUsecase } from "../../../../Application/company/interfaces/interview/ICompany.scheduleInterview.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class CompanyInterviewController {
    constructor(
        private _scheduleInterview: ICompanyScheduleInterviewUsecase
    ) {}

    scheduleInterview = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const {interview} = await this._scheduleInterview.execute({companyId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', interview)
    })
}