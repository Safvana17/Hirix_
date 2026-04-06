import { NextFunction, Request, Response } from "express";
import { ICompanyCreateQuestionUsecase } from "../../../../Application/company/interfaces/question/iCompany.createQuestion.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { logger } from "../../../../utils/logging/loger";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { ICompanyGetAllQuestionsUsecase } from "../../../../Application/company/interfaces/question/iCompany.getAllQuestions.usecase";
import { getAllQuestionSchema } from "../../validators/questionValidator";

export class CompanyQuestionController {
    constructor (
        private _createQuestion: ICompanyCreateQuestionUsecase,
        private _getAllQuestions: ICompanyGetAllQuestionsUsecase,
    ) {}

    createQuestion = asyncHandler (async( req: Request, res: Response, next: NextFunction) => {
        logger.info(req.user, 'from controller')
        const question = await this._createQuestion.execute({...req.body,user: req.user })
        return sendSuccess(res, statusCode.OK, questionMessages.success.COMPANY_TEST_QUESTION_CREATED, question)
    })

    getAllQuestions = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const parsed = getAllQuestionSchema.parse(req.query)
        const questions = await this._getAllQuestions.execute({...parsed, role: req.user.role, userId: req.user.id})
        logger.info(questions)
        return sendSuccess(res, statusCode.OK, "", questions)
    })
}