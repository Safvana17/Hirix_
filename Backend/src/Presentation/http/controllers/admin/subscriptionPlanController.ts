import { Request, Response } from "express";
import { ICreateSubscriptionPlanUsecase } from "../../../../Application/admin/interfaces/subscriptionPlan/ISubscriptionPlan.admin.create.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { PlanQuerySchema } from "../../validators/subscriptionPlanValidator";
import { IAdminGetAllSubscriptionPlanUsecase } from "../../../../Application/admin/interfaces/subscriptionPlan/ISubscriptionPlan.admin.getAll.usecase";
import { logger } from "../../../../utils/logging/loger";
import { IAdminEditSubscriptionPlanUsecase } from "../../../../Application/admin/interfaces/subscriptionPlan/ISubscriptionPlan.admin.edit.usecase";
import { IAdminUpdateSubscriptionPlanStatusUsecase } from "../../../../Application/admin/interfaces/subscriptionPlan/ISubscriptionPlan.admin.updateStatus.usecase";
import { IAdminDeleteSubscriptionPlanUsecase } from "../../../../Application/admin/interfaces/subscriptionPlan/ISubscriptionPlan.admin.delete.usecase";

export class SubscriptionPlanController {
    constructor (
        private _createSubcriptionPlan: ICreateSubscriptionPlanUsecase,
        private _getAllSubscriptionPlans: IAdminGetAllSubscriptionPlanUsecase,
        private _editSubscriptionPlan: IAdminEditSubscriptionPlanUsecase,
        private _updatePanStatus: IAdminUpdateSubscriptionPlanStatusUsecase,
        private _deletePlan: IAdminDeleteSubscriptionPlanUsecase
    ) {}

    createPlan = asyncHandler( async(req: Request, res: Response) => {
        const plan = await this._createSubcriptionPlan.execute(req.body)
        return sendSuccess(res, statusCode.OK, subscriptionPlanMessages.success.PLAN_CREATED, plan)
    })

    getAllPlans = asyncHandler(async(req: Request, res: Response) => {
        const parsed = PlanQuerySchema.parse(req.query)
        const subscriptionPlans = await this._getAllSubscriptionPlans.execute(parsed)
        logger.info(subscriptionPlans)
        return sendSuccess(res, statusCode.OK, '', subscriptionPlans)
    })

    editPlan = asyncHandler(async(req: Request, res: Response) => {
        const planId = Array.isArray(req.params.id)
              ? req.params.id[0]
              : req.params.id
        const updatedPlan = await this._editSubscriptionPlan.execute({id: planId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', updatedPlan.plan)
    })

    updateStatus = asyncHandler(async(req: Request, res: Response) => {
        const planId = Array.isArray(req.params.id)
              ? req.params.id[0]
              : req.params.id   
        const {id, status } = await this._updatePanStatus.execute({id: planId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', {id, status})    
    })

    deletePlan = asyncHandler(async(req: Request, res: Response) => {
        const planId = Array.isArray(req.params.id)
              ? req.params.id[0]
              : req.params.id 
        const {id} =await this._deletePlan.execute({id: planId, ...req.body})   
        return sendSuccess(res, statusCode.OK, '', {id})
    })
}