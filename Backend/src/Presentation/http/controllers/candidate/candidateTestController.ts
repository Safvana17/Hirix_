import { Request, Response } from "express";
import { ICandidateGetTestByTokenUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.getTestByToken.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { TestTokenParams } from "../../validators/companyTest.validator";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";

export class CandidatetestController {
    constructor (
        private _getTestByToken: ICandidateGetTestByTokenUsecase,
    ) {}

    getTestByToken = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const test  = await this._getTestByToken.execute({token})
        logger.info(test, 'from controller')
        return sendSuccess(res, statusCode.OK, '', test)
    })
}