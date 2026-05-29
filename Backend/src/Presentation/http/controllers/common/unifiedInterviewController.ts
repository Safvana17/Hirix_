import { Request, Response } from "express";
import { IUnifiedGetInterviewAccessUsecase } from "../../../../Application/common/interfaces/IUnified.GetInterviewAccess.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { InterviewAccessParams } from "../../validators/interviewValidator";

export class UnifiedInterviewController {
    constructor (
        private _getInterviewAccess: IUnifiedGetInterviewAccessUsecase,
    ) {}

    getInterviewAccess = asyncHandler( async(req: Request, res: Response ) => {
        const {token, roomId} = req.validatedParams as InterviewAccessParams
        const accessInterview = await this._getInterviewAccess.execute({token, roomId})
        return sendSuccess(res, statusCode.OK, '', accessInterview)
    })
}