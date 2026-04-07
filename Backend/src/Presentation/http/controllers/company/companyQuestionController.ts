import { NextFunction, Request, Response } from "express";
import { ICompanyCreateQuestionUsecase } from "../../../../Application/company/interfaces/question/iCompany.createQuestion.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { logger } from "../../../../utils/logging/loger";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { ICompanyGetAllQuestionsUsecase } from "../../../../Application/company/interfaces/question/iCompany.getAllQuestions.usecase";
import { getAllQuestionSchema } from "../../validators/questionValidator";
import { ICompanyEditQuestionUsecase } from "../../../../Application/company/interfaces/question/iCompany.editQuestion.usecase";
import { ICompanyDeleteQuestionUsecase } from "../../../../Application/company/interfaces/question/iCompany.deleteQuestion.usecase";

export class CompanyQuestionController {
    constructor (
        private _createQuestion: ICompanyCreateQuestionUsecase,
        private _getAllQuestions: ICompanyGetAllQuestionsUsecase,
        private _editQuestion: ICompanyEditQuestionUsecase,
        private _deleteQuestion: ICompanyDeleteQuestionUsecase
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
        const question = await this._deleteQuestion.execute({id: quesionId, user: req.user})

        return sendSuccess(res, statusCode.OK, "", question)
    })
}