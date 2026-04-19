import { NextFunction, Request, Response } from "express";
import { ICandidateGetAllPracticeQuestionUsecase } from "../../../../Application/candidate/interfaces/practiceLibrary/iCandidate.getAllPracticeQuestions.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { getAllQuestionSchema } from "../../validators/questionValidator";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class PracticeLibraryController{
    constructor(
        private _getAllQuestions: ICandidateGetAllPracticeQuestionUsecase
    ) {}

    getAllPracticeQuestions = asyncHandler( async(req: Request, res: Response, next: NextFunction) => {
        const candidateId = req.user.id
        const parsed = getAllQuestionSchema.parse(req.query)
        const { practiceQuestions, totalCount, totalPages } = await this._getAllQuestions.execute({...parsed, candidateId})
        return sendSuccess(res, statusCode.OK, '', {practiceQuestions, totalCount, totalPages})
    })
}