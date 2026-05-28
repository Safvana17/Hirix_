import { Request, Response } from "express";
import { ICompanyScheduleInterviewUsecase } from "../../../../Application/company/interfaces/interview/ICompany.scheduleInterview.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICompanyGetAllInterviewsUsecase } from "../../../../Application/company/interfaces/interview/ICompany.getAllInterview.usecase";
import { GetAllInterviewQuery, InterviewParams } from "../../validators/interviewValidator";
import { ICompanyCancelInterviewUsecase } from "../../../../Application/company/interfaces/interview/ICompany.cancelInterview.usecase";
import { ICompanyRescheduleInterviewUsecase } from "../../../../Application/company/interfaces/interview/ICompany.rescheduleInterview.usecase";
import { ICompanyGetInterviewByIdUsecase } from "../../../../Application/company/interfaces/interview/ICompany.getInterviewById.usecase";
import { ICompanyEditInterviewUsecase } from "../../../../Application/company/interfaces/interview/ICompany.editInterview.usecase";

export class CompanyInterviewController {
    constructor(
        private _scheduleInterview: ICompanyScheduleInterviewUsecase,
        private _getAllInterviews: ICompanyGetAllInterviewsUsecase,
        private _cancelInterview: ICompanyCancelInterviewUsecase,
        private _rescheduleInterview: ICompanyRescheduleInterviewUsecase,
        private _getInterviewById: ICompanyGetInterviewByIdUsecase,
        private _editInterview: ICompanyEditInterviewUsecase,
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

    cancelInterview = asyncHandler( async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { interviewId } = req.validatedParams as InterviewParams
        await this._cancelInterview.execute({companyId, interviewId, reason: req.body.reason})
        return sendSuccess(res, statusCode.OK, '')
    })

    rescheduleInterview = asyncHandler( async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { interviewId } = req.validatedParams as InterviewParams
        await this._rescheduleInterview.execute({companyId, interviewId, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    getInterviewById = asyncHandler( async (req: Request, res: Response) => {
        const companyId = req.user.id
        const { interviewId } = req.validatedParams as InterviewParams
        const { interview } = await this._getInterviewById.execute({companyId, interviewId})
        return sendSuccess(res, statusCode.OK, '', interview)
    })

    editInterview = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { interviewId } = req.validatedParams as InterviewParams
        await this._editInterview.execute({companyId, interviewId, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })
}