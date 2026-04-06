import { NextFunction, Request, Response } from "express";
import { ICompanyCreateQuestionUsecase } from "../../../../Application/company/interfaces/question/iCompany.createQuestion.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { logger } from "../../../../utils/logging/loger";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";

export class CompanyQuestionController {
    constructor (
        private _createQuestion: ICompanyCreateQuestionUsecase
    ) {}

    createQuestion = asyncHandler (async( req: Request, res: Response, next: NextFunction) => {
        logger.info(req.user, 'from controller')
        const question = await this._createQuestion.execute({...req.body,user: req.user })
        return sendSuccess(res, statusCode.OK, questionMessages.success.COMPANY_TEST_QUESTION_CREATED, question)
    })
}