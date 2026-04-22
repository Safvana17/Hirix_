import { Request, Response } from "express";
import { IUnifiedGetMyNotificationsUsecase } from "../../../../Application/common/interfaces/IUnified.getMyNotifications.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendSuccess } from "../../utils/apiResponse";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IUnifiedMarkAllAsReadUsecase } from "../../../../Application/common/interfaces/IUnified.allMarkAsRead.usecase";

export class UnifiedSettingsController {
    constructor(
        private _getMyNotifications: IUnifiedGetMyNotificationsUsecase,
        private _markAllAsRead: IUnifiedMarkAllAsReadUsecase,
    ) {}

    getNotification = asyncHandler(async(req: Request, res: Response) => {
        const userId = req.user.id
        const userRole = req.user.role
        const notifications = await this._getMyNotifications.execute({userId, role: userRole})
        return sendSuccess(res, statusCode.OK, '', notifications.notifications)
    })

    markAllAsRead = asyncHandler(async(req: Request, res: Response) => {
        const userId = req.user.id
        const userRole = req.user.role
        await this._markAllAsRead.execute({userId, role: userRole })
        return sendSuccess(res, statusCode.OK, '')
    })
}