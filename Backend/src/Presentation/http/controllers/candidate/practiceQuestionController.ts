import { Request, Response } from "express";
import { ICandidateGetAllPracticeQuestionUsecase } from "../../../../Application/candidate/interfaces/practiceLibrary/iCandidate.getAllPracticeQuestions.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { getAllQuestionSchema, QuestionParams } from "../../validators/questionValidator";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICandidateGetQuestionByIdUsecase } from "../../../../Application/candidate/interfaces/practiceLibrary/ICandidate.getQuestionById.usecase";
import { ICandidateGetRelatedQuestionsUsecase } from "../../../../Application/candidate/interfaces/practiceLibrary/ICandidate.getRelatedQuestions.usecase";

export class PracticeLibraryController{
    constructor(
        private _getAllQuestions: ICandidateGetAllPracticeQuestionUsecase,
        private _getQuestionById: ICandidateGetQuestionByIdUsecase,
        private _getRelatedQuestions: ICandidateGetRelatedQuestionsUsecase,
    ) {}

    getAllPracticeQuestions = asyncHandler( async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const parsed = getAllQuestionSchema.parse(req.query)
        const { practiceQuestions, totalCount, totalPages } = await this._getAllQuestions.execute({...parsed, candidateId})
        return sendSuccess(res, statusCode.OK, '', {practiceQuestions, totalCount, totalPages})
    })

    getQuestionById = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const { questionId } = req.validatedParams as QuestionParams
        const question = await this._getQuestionById.execute({candidateId, questionId})
        return sendSuccess(res, statusCode.OK, '', {question})
    }) 

    getRelatedQuestions = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const { questionId } = req.validatedParams as QuestionParams
        const {questions} = await this._getRelatedQuestions.execute({candidateId, questionId})  
        return sendSuccess(res, statusCode.OK, '', questions)     
    })
}