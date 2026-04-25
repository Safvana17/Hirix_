import { Request, Response } from "express";
import { IAdminCreateEmailTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.createEmailTemplate";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminGetAllTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.getAllTemplates.usecase";
import { getAllRulesQuery, GetAllTemplateQuery, templateParams } from "../../validators/adminSettingsValidator";
import { logger } from "../../../../utils/logging/loger";
import { IAdminEditTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.editTemplate.usecase";
import { IAdminCreateNotificationRuleUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.createNotificationRule.usecase";
import { IAdminGetAllNotificationRuleUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.getAllNotificationRule";
import { IAdminUpdateNotificationRuleUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.updateNotificationRule.usecase";
import { IAdminUpdateEmailTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.updateTemplate.usecase";
import { IAdminDeleteTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.deleteTemplate.usecase";
import { IAdminDeleteNotificationRuleUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.deleteNotificationRule.usecase";

export class AdminSettingsController {
    constructor(
        private _createEmailTemplate: IAdminCreateEmailTemplateUsecase,
        private _getAllTemplates: IAdminGetAllTemplateUsecase,
        private _EditTemplate: IAdminEditTemplateUsecase,
        private _createNotificationRule: IAdminCreateNotificationRuleUsecase,
        private _getAllNotificationRule: IAdminGetAllNotificationRuleUsecase,
        private _updateNotificationRule: IAdminUpdateNotificationRuleUsecase,
        private _updateTemplateStatus: IAdminUpdateEmailTemplateUsecase,
        private _deleteTemplate: IAdminDeleteTemplateUsecase,
        private _deleteNotificationRule: IAdminDeleteNotificationRuleUsecase,
    ) {}

    createTemplate = asyncHandler(async(req: Request, res: Response) => {
        await this._createEmailTemplate.execute(req.body)
        return sendSuccess(res, statusCode.OK, '')
    })

    getAllTemplates = asyncHandler(async(req: Request, res: Response) => {
        const query = req.validatedQuery as GetAllTemplateQuery
        logger.info(query, 'from controller')
        const { templates, totalPages, totalCount } = await this._getAllTemplates.execute({...query})
        return sendSuccess(res, statusCode.OK, '', {templates, totalPages, totalCount})
    })

    editTemplate = asyncHandler( async(req: Request, res: Response) => {
        const templateId = req.params.id
        logger.info(req.body, 'from controller')
        const updatedTemplate = await this._EditTemplate.execute({id: templateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', updatedTemplate)
    })

    createNotificationRule = asyncHandler(async(req: Request, res: Response) => {
        const result = await this._createNotificationRule.execute(req.body)
        return sendSuccess(res, statusCode.OK, '', result)
    })

    getAllRules = asyncHandler(async(req: Request, res: Response) => {
        const query = req.validatedQuery as getAllRulesQuery
        const { rules, totalCount, totalPages }= await this._getAllNotificationRule.execute(query)
        return sendSuccess(res, statusCode.OK, '', { rules, totalCount, totalPages })
    })

    updateNotificationRule = asyncHandler(async(req: Request, res: Response) => {
        const ruleId = req.params.id
        const updateRule = await this._updateNotificationRule.execute({id: ruleId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', updateRule)
    })

    updatetemplateStatus = asyncHandler(async(req: Request, res: Response) => {
        const { id } = req.validatedParams as templateParams
        const updatedTemplate = await this._updateTemplateStatus.execute({id, status: req.body.status})
        return sendSuccess(res, statusCode.OK, '', updatedTemplate)
    })

    deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.validatedParams as templateParams
        await this._deleteTemplate.execute({id})
        return sendSuccess(res, statusCode.OK, '')
    })

    deleteNotificationRule = asyncHandler(async(req: Request, res: Response) => {
        const { id } = req.validatedParams as templateParams
        await this._deleteNotificationRule.execute({id})
        return sendSuccess(res, statusCode.OK, '')
    })


}