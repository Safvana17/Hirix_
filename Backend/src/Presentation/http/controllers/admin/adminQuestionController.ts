import { NextFunction, Request, Response } from "express";
import { IAdminCreateQuestionUsecase } from "../../../../Application/admin/interfaces/question/iAdminCreateQuestionUsecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";

export class AdminQestionController {
    constructor(
        private _createQuestion: IAdminCreateQuestionUsecase
    ) {}

    createQuestion = asyncHandler (async( req: Request, res: Response, next: NextFunction) => {
        const question = await this._createQuestion.execute(req.body)
        return sendSuccess(res, statusCode.OK, questionMessages.success.ADMIN_TEST_QUESTION_CREATED, question)
    })
}