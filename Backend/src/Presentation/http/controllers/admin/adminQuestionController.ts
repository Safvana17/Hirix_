import { NextFunction, Request, Response } from "express";
import { IAdminCreateQuestionUsecase } from "../../../../Application/admin/interfaces/question/iAdminCreateQuestionUsecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { IAdminGetAllQuestionUsecase } from "../../../../Application/admin/interfaces/question/iAdmin.getAllQuestions.usecase";
import { getAllQuestionSchema } from "../../validators/questionValidator";
import { logger } from "../../../../utils/logging/loger";

export class AdminQestionController {
    constructor(
        private _createQuestion: IAdminCreateQuestionUsecase,
        private _getAllQuestions: IAdminGetAllQuestionUsecase,
    ) {}

    createQuestion = asyncHandler (async( req: Request, res: Response, next: NextFunction) => {
        const question = await this._createQuestion.execute(req.body)
        return sendSuccess(res, statusCode.OK, questionMessages.success.ADMIN_TEST_QUESTION_CREATED, question)
    })
    getAllQuestions = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const parsed = getAllQuestionSchema.parse(req.query)
        const questions = await this._getAllQuestions.execute(parsed)
        logger.info(questions)
        return sendSuccess(res, statusCode.OK, "", questions)
    })
}