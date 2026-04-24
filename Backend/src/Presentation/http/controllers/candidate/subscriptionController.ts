import { Request, Response } from "express";
import { ICandidateGetAllPlansUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getAllPlans.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { CancelSubscriptionParam, getInvoiceParam, PaymentQuery, UserPlanQuerySchema } from "../../validators/subscriptionValidators";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ICandidateGetCurrentPlanUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getCurrentPlan.usecase";
import { ICandidateChangeSubscriptionUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.changeSubscription.usecase";
import { ICandidateMakePaymentUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.makePayment.usecase";
import { ICandidateConfirmPaymentUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.confirmPayment.usecase";
import { ICandidateMarkPaymentFailureUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.markPaymentFailure.usecase";
import { ICandidateGetBillingHistoryUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getBillingHistory.usecase";
import { ICandidateCancelSubscriptionUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.cancelSubscription.usecase";
import { ICandidateGetInvoiceUsecase } from "../../../../Application/candidate/interfaces/subscription/ICandidate.getInvoice.usecase";

export class CandidateSubscriptionController {
    constructor(
        private _getAllPlans: ICandidateGetAllPlansUsecase,
        private _getCurrentPlan: ICandidateGetCurrentPlanUsecase,
        private _changeSubscription: ICandidateChangeSubscriptionUsecase,
        private _makePayment: ICandidateMakePaymentUsecase,
        private _confirmPayment: ICandidateConfirmPaymentUsecase,
        private _markFailure: ICandidateMarkPaymentFailureUsecase,
        private _getBillingHistory: ICandidateGetBillingHistoryUsecase,
        private _CancelSubscription: ICandidateCancelSubscriptionUsecase,
        private _getInvoice: ICandidateGetInvoiceUsecase
    ) {}

    getAllPlan = asyncHandler(async (req: Request, res: Response) => {
        const parsed = UserPlanQuerySchema.parse(req.query)
        const subscriptionPlans = await this._getAllPlans.execute(parsed)
        return sendSuccess(res, statusCode.OK, '', subscriptionPlans)
    })

    getCurrentPlan = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const currentPlan = await this._getCurrentPlan.execute({id: candidateId})
        return sendSuccess(res, statusCode.OK, '', currentPlan)
    })

    changePlan = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const changedPlan = await this._changeSubscription.execute({candidateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', changedPlan)
    })

    makePayment = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const result = await this._makePayment.execute({candidateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', result)
    })

    confirmPayment = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        await this._confirmPayment.execute({candidateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    markFailed = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        await this._markFailure.execute({candidateId, orderId: req.body.orderId})
        return sendSuccess(res, statusCode.OK, '')
    })

    getBillingHistory = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const {status, page, limit} = req.validatedQuery as PaymentQuery
        const { payments, totalCount, totalPages } = await this._getBillingHistory.execute({userId: candidateId, status, page, limit})
        return sendSuccess(res, statusCode.OK, '', {payments, totalCount, totalPages})
    })

    cancelSubscription = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const { id }= req.validatedParams as CancelSubscriptionParam
        const currentPlan = await this._CancelSubscription.execute({ candidateId, subscriptionId: id})
        return sendSuccess(res, statusCode.OK, '', currentPlan)
    })

    getInvoice = asyncHandler(async(req: Request, res: Response) => {
        const candidateId = req.user.id
        const { id } = req.params as getInvoiceParam
        const result = await this._getInvoice.execute({candidateId, paymentId: id})
        res.setHeader('Content-Type', result.mimeType)
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${result.fileName}`
        )

        return res.send(result.buffer)
    })
}