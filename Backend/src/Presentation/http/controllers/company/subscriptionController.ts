import { Request, Response } from "express";
import { ICompanyGetAllPlanUsecase } from "../../../../Application/company/interfaces/subscription/ICompanyGetAllPlanUsecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { UserPlanQuerySchema } from "../../validators/subscriptionValidators";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { ICompanyGetCurrentPlanUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.getCurrentPlan.usecase";
import { ICompanyChangeSubscriptionUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.changeSubscription.usecase";
import { ICompanyMakePaymentUsecase } from "../../../../Application/company/interfaces/subscription/ICompany.makePayment.usecase";

export class CompanySubscriptionController {
    constructor (
        private _getAllPlans: ICompanyGetAllPlanUsecase,
        private _getCurrentPlan: ICompanyGetCurrentPlanUsecase,
        private _changeSubscription: ICompanyChangeSubscriptionUsecase,
        private _makePayment: ICompanyMakePaymentUsecase
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
}