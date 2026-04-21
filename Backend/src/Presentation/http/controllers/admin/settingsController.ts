import { Request, Response } from "express";
import { IAdminCreateEmailTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.createEmailTemplate";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminGetAllTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.getAllTemplates.usecase";
import { GetAllTemplateQuery } from "../../validators/adminSettingsValidator";
import { logger } from "../../../../utils/logging/loger";
import { IAdminEditTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.editTemplate.usecase";

export class AdminSettingsController {
    constructor(
        private _createEmailTemplate: IAdminCreateEmailTemplateUsecase,
        private _getAllTemplates: IAdminGetAllTemplateUsecase,
        private _EditTemplate: IAdminEditTemplateUsecase,
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
        const updatedTemplate = await this._EditTemplate.execute({id: templateId, ...req.body})
        return sendSuccess(res, statusCode.OK, '', updatedTemplate)
    })
}