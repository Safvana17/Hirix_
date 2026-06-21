import { Request, Response } from "express";
import { ICandidateGetTestByTokenUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.getTestByToken.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { TestTokenParams } from "../../validators/companyTest.validator";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { ICandidateTestLoginUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.testLogin.usecase";
import { ICandidateStartTestUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.startTest.usecase";
import { ICandidateRunCodeUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.runCode.usecase";
import { ICandidateSubmitTestUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.submitTest.usecase";
import { ICandidateTerminateTestUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.terminateTest.usecase";
import { ICandidateSubmitQuestionUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.submitQuestion.usecase";
import { ICandidateGetAllCategoriesUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.getAllCategories.usecase";
import { ICandidateSaveAnswerUsecase } from "../../../../Application/candidate/interfaces/test/ICandidae.saveAnswer.usecase";
import { ICandidateWarningCountUsecase } from "../../../../Application/candidate/interfaces/test/ICandiate.warningCount.usecase";
import { ICandidateGenereateSnapshotUrlUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.generateSnapshotUrl.usecase";
import { ICandidateSaveSnapshotUsecase } from "../../../../Application/candidate/interfaces/test/ICandidate.saveSnapshot.usecase";

export class CandidatetestController {
    constructor (
        private _getTestByToken: ICandidateGetTestByTokenUsecase,
        private _candidateLogin: ICandidateTestLoginUsecase,
        private _startTest: ICandidateStartTestUsecase,
        private _runCode: ICandidateRunCodeUsecase,
        private _submitTest: ICandidateSubmitTestUsecase,
        private _terminateCandidate: ICandidateTerminateTestUsecase,
        private _submitQuestion: ICandidateSubmitQuestionUsecase,
        private _getAllCategories: ICandidateGetAllCategoriesUsecase,
        private _saveAnswer: ICandidateSaveAnswerUsecase,
        private _warningCount: ICandidateWarningCountUsecase,
        private _generateSnapshotUrl: ICandidateGenereateSnapshotUrlUsecase,
        private _saveSnapshot: ICandidateSaveSnapshotUsecase
    ) {}

    getTestByToken = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const clientSessionToken = req.cookies.testSession
        const {test, candidate}  = await this._getTestByToken.execute({token, clientSessionToken})
        logger.info(test, 'from controller')
        return sendSuccess(res, statusCode.OK, '', {test, candidate})
    })

    candidateLogin = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const {test, candidate} = await this._candidateLogin.execute({token, ...req.body})
        const maxAge = new Date(test.endTime).getTime() - Date.now()
        res.cookie('testSession', candidate.sessionToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: maxAge > 0 ? maxAge : 0
        })
        return sendSuccess(res, statusCode.OK, '', {test, candidate})
    })

    startTest = asyncHandler(async(req: Request, res: Response) => {
        const {token} = req.validatedParams as TestTokenParams
        const clientSessionToken = req.cookies.testSession
        logger.info(token)
        const  {test, candidate} = await this._startTest.execute({token, clientSessionToken})
        return sendSuccess(res, statusCode.OK, '', { test, candidate })
    })

    runCode = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const clientSessionToken = req.cookies.testSession
        const { feedback } = await this._runCode.execute({token, clientSessionToken, ...req.body})
        return sendSuccess(res, statusCode.OK, '', {feedback})
    })

    submittest = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const clientSessionToken = req.cookies.testSession
        await this._submitTest.execute({token, clientSessionToken, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    terminateTest = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        await this._terminateCandidate.execute({token, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    submitQuestion = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        await this._submitQuestion.execute({token, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    getAllCategories = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const categories = await this._getAllCategories.execute({token})
        return sendSuccess(res, statusCode.OK, '', categories.categories)
    })

    saveAnswers = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const clientSessionToken = req.cookies.testSession
        await this._saveAnswer.execute({token, clientSessionToken, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    warningCount = asyncHandler(async(req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const { warningCount } = await this._warningCount.execute({token, ...req.body})
        return sendSuccess(res, statusCode.OK, '', warningCount)
    })

    generateUrl = asyncHandler( async (req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const clientSessionToken = req.cookies.testSession
        const { uploadUrl, key} = await this._generateSnapshotUrl.execute({token, clientSessionToken, ...req.body})
        return sendSuccess(res, statusCode.OK, '', {uploadUrl, key})
    })

    saveSnapshot = asyncHandler ( async (req: Request, res: Response) => {
        const { token } = req.validatedParams as TestTokenParams
        const clientSessionToken = req.cookies.testSession
        await this._saveSnapshot.execute({token, clientSessionToken, key: req.body.key})
        return sendSuccess(res, statusCode.OK, '')
    })
}