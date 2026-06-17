import { Request, Response } from "express";
import { IUnifiedGetInterviewAccessUsecase } from "../../../../Application/common/interfaces/IUnified.GetInterviewAccess.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { InterviewAccessParams } from "../../validators/interviewValidator";
import { IUnifiedJoinInterviewUsecase } from "../../../../Application/common/interfaces/IUnified.joinUnterview.usecase";
import { IUnifiedEndInterviewCallUsecase } from "../../../../Application/common/interfaces/IUnified.endInterviewCall.usecase";
import { IUnifiedRunInterviewCodeUsecase } from "../../../../Application/common/interfaces/IUnified.runInterviewCode.usecase";
import { ICandidateLeftInterviewRoomUsecase } from "../../../../Application/common/interfaces/ICandidate.leftInterview.usecase";

export class UnifiedInterviewController {
    constructor (
        private _getInterviewAccess: IUnifiedGetInterviewAccessUsecase,
        private _joinInterview: IUnifiedJoinInterviewUsecase,
        private _endInterview: IUnifiedEndInterviewCallUsecase,
        private _runCode: IUnifiedRunInterviewCodeUsecase,
        private _candidateLeft: ICandidateLeftInterviewRoomUsecase
    ) {}

    getInterviewAccess = asyncHandler( async(req: Request, res: Response ) => {
        const {token, roomId} = req.validatedParams as InterviewAccessParams
        const accessInterview = await this._getInterviewAccess.execute({token, roomId})
        return sendSuccess(res, statusCode.OK, '', accessInterview)
    })

    joinInterview = asyncHandler(async(req: Request, res: Response) => {
        const { token, roomId } = req.validatedParams as InterviewAccessParams
        const { canJoin } = await this._joinInterview.execute({ token, roomId })
        return sendSuccess(res, statusCode.OK, '', canJoin )
    })

    endInterview = asyncHandler(async(req: Request, res: Response) => {
        const { token, roomId } = req.validatedParams as InterviewAccessParams
        const interview = await this._endInterview.execute({ token, roomId })
        return sendSuccess(res, statusCode.OK, '', interview )
    })

    runCode = asyncHandler( async (req: Request, res: Response) => {
        const result = await this._runCode.execute(req.body)
        return sendSuccess(res, statusCode.OK, '', result)
    })

    candidateLeft = asyncHandler(async(req: Request, res: Response) => {
        const { token, roomId } = req.validatedParams as InterviewAccessParams
        const interview = await this._candidateLeft.execute({ token, roomId })
        return sendSuccess(res, statusCode.OK, '', interview )
    })
}