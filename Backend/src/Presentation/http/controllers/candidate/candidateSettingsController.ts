import { Request, Response } from "express";
import { ICandidateChangePasswordUsecase } from "../../../../Application/candidate/interfaces/profile/ICandidate.changePassword.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICandidateGetInterviewHistoryUsecase } from "../../../../Application/candidate/interfaces/profile/ICandidate.getInterviewHistory.usecase";
import { PaymentHistoryQuery } from "../../validators/analyticsValidator";
import { ICandidateUpdateProfileUsecase } from "../../../../Application/candidate/interfaces/profile/ICandidate.updateProfile.usecase";

export class CandidateSettingsController {
    constructor (
        private _candidateChangePasswordUsecase: ICandidateChangePasswordUsecase,
        private _candidateGetInterviewHistory: ICandidateGetInterviewHistoryUsecase,
        private _candidateUpdateProfileUsecase: ICandidateUpdateProfileUsecase,
    ) {}

    changePassword = asyncHandler (async (req: Request, res: Response ) => {
        const candidateId = req.user.id
        await this._candidateChangePasswordUsecase.execute({candidateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    interviewHistory = asyncHandler (async (req: Request, res: Response) => {
        const candidateId = req.user.id
        const query = req.validatedQuery as PaymentHistoryQuery
        const { history, totalPages, totalCount } = await this._candidateGetInterviewHistory.execute({ candidateId, ...query})
        return sendSuccess(res, statusCode.OK, '', { history, totalCount, totalPages })
    })

    updateProfile = asyncHandler (async(req: Request, res: Response) => {
        const candidateId = req.user.id
        await this._candidateUpdateProfileUsecase.execute({candidateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })
}