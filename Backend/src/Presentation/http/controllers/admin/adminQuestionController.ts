import { NextFunction, Request, Response } from "express";
import { IAdminCreateQuestionUsecase } from "../../../../Application/admin/interfaces/question/iAdminCreateQuestionUsecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { IAdminGetAllQuestionUsecase } from "../../../../Application/admin/interfaces/question/iAdmin.getAllQuestions.usecase";
import { getAllQuestionSchema } from "../../validators/questionValidator";
import { logger } from "../../../../utils/logging/loger";
import { IAdminEditQuestionUsecase } from "../../../../Application/admin/interfaces/question/iAdmin.editQuestion.usecase";
import { IAdminDeleteQuestionUsecase } from "../../../../Application/admin/interfaces/question/iAdmin.deleteQuestion.usecase";

export class AdminQestionController {
    constructor(
        private _createQuestion: IAdminCreateQuestionUsecase,
        private _getAllQuestions: IAdminGetAllQuestionUsecase,
        private _editQuestion: IAdminEditQuestionUsecase,
        private _deleteQuestion: IAdminDeleteQuestionUsecase,
    ) {}

    createQuestion = asyncHandler (async( req: Request, res: Response, next: NextFunction) => {
        logger.info(req.user, 'from controller')
        const question = await this._createQuestion.execute({...req.body,user: req.user })
        return sendSuccess(res, statusCode.OK, questionMessages.success.ADMIN_TEST_QUESTION_CREATED, question)
    })

    getAllQuestions = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const parsed = getAllQuestionSchema.parse(req.query)
        const questions = await this._getAllQuestions.execute(parsed)
        logger.info(questions)
        return sendSuccess(res, statusCode.OK, "", questions)
    })

    editQuestion = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const questionId = Array.isArray (req.params.id ) 
            ? req.params.id[0]
            :req.params.id 
        
        const updatedQuestion = await this._editQuestion.execute({id: questionId, ...req.body})
        return sendSuccess(res, statusCode.OK, questionMessages.success.QUESTION_UPDATED_SUCCESSFULLY, updatedQuestion)
    })
    deleteQuestion = asyncHandler( async (req: Request, res: Response, next: NextFunction) => {
        const quesionId = Array.isArray(req.params.id)
              ? req.params.id[0]
              : req.params.id
        const question = await this._deleteQuestion.execute({id: quesionId})

        return sendSuccess(res, statusCode.OK, "", question)
    })
}