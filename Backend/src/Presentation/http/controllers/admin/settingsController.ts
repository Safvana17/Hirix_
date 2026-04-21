import { Request, Response } from "express";
import { IAdminCreateEmailTemplateUsecase } from "../../../../Application/admin/interfaces/settings/IAdmin.createEmailTemplate";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";

export class AdminSettingsController {
    constructor(
        private _createEmailTemplate: IAdminCreateEmailTemplateUsecase
    ) {}

    createTemplate = asyncHandler(async(req: Request, res: Response) => {
        await this._createEmailTemplate.execute(req.body)
        return sendSuccess(res, statusCode.OK, '')
    })
}