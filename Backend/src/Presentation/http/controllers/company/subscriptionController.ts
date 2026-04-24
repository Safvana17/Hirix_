import { Request, Response } from "express";
import { ICompanyGetAllPlanUsecase } from "../../../../Application/company/interfaces/subscription/ICompanyGetAllPlanUsecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { CancelSubscriptionParam, getInvoiceParam, PaymentQuery, UserPlanQuerySchema } from "../../validators/subscriptionValidators";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { ICompanyGetCurrentPlanUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.getCurrentPlan.usecase";
import { ICompanyChangeSubscriptionUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.changeSubscription.usecase";
import { ICompanyMakePaymentUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.makePayment.usecase";
import { ICompanyConfirmPaymentUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.confirmPyment.usecase";
import { ICompanyPaymentFailureUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.paymentFailure.usecase";
import { IGetCompanyBillingHistoryUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.getBillingHistory.usecase";
import { ICompanyCancelSubscriptionUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.cancelSubscription.usecase";
import { ICompanyDownloadInvoiceUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.downloadInvoice.usecase";


export class CompanySubscriptionController {
    constructor (
        private _getAllPlans: ICompanyGetAllPlanUsecase,
        private _getCurrentPlan: ICompanyGetCurrentPlanUsecase,
        private _changeSubscription: ICompanyChangeSubscriptionUsecase,
        private _makePayment: ICompanyMakePaymentUsecase,
        private _confirmPayment: ICompanyConfirmPaymentUsecase,
        private _paymentFailure: ICompanyPaymentFailureUsecase,
        private _getBillingHistory: IGetCompanyBillingHistoryUsecase,
        private _cancelSubscription: ICompanyCancelSubscriptionUsecase,
        private _getInvoice: ICompanyDownloadInvoiceUsecase
    ) {}

    getAllPlan = asyncHandler(async (req: Request, res: Response) => {
        const parsed = UserPlanQuerySchema.parse(req.query)
        const subscriptionPlans = await this._getAllPlans.execute(parsed)
        return sendSuccess(res, statusCode.OK, '', subscriptionPlans)
    })

    getCurrentPlan = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        logger.info(companyId, 'user')
        const currentPlan = await this._getCurrentPlan.execute({id: companyId})
        return sendSuccess(res, statusCode.OK, '', currentPlan)
    })

    changePlan = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const changedPlan = await this._changeSubscription.execute({companyId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', changedPlan)
    })

    makePayment = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const result = await this._makePayment.execute({companyId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', result)
    })

    confirmPayment = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        await this._confirmPayment.execute({companyId, ...req.body})
        return sendSuccess(res, statusCode.OK, '')
    })

    markFailed = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        await this._paymentFailure.execute({companyId, orderId: req.body.orderId})
        return sendSuccess(res, statusCode.OK, '')
    })

    getBillingHistory = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const {status, page, limit} = req.validatedQuery as PaymentQuery
        const { payments, totalCount, totalPages } = await this._getBillingHistory.execute({userId: companyId, status, page, limit})
        logger.info(payments, 'from subscription controller')
        return sendSuccess(res, statusCode.OK, '', {payments, totalCount, totalPages})
    })

    cancelSubscription = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { id }= req.validatedParams as CancelSubscriptionParam
        const currentPlan = await this._cancelSubscription.execute({companyId, subscriptionId: id})
        return sendSuccess(res, statusCode.OK, '', currentPlan)
    })

    getInvoice = asyncHandler(async(req: Request, res: Response) => {
        const companyId = req.user.id
        const { id } = req.params as getInvoiceParam
        const result = await this._getInvoice.execute({companyId, paymentId: id})
        res.setHeader('Content-Type', result.mimeType)
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${result.fileName}`
        )

        return res.send(result.buffer)
    })
}