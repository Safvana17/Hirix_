import { Request, Response } from "express";
import { ICandidateChangePasswordUsecase } from "../../../../Application/candidate/interfaces/profile/ICandidate.changePassword.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class CandidateSettingsController {
    constructor (
        private _candidateChangePasswordUsecase: ICandidateChangePasswordUsecase
    ) {}

    changePassword = asyncHandler (async (req: Request, res: Response ) => {
        const candidateId = req.user.id
        await this._candidateChangePasswordUsecase.execute({candidateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })
}