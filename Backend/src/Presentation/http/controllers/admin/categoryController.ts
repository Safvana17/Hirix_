import { NextFunction, Request, Response } from "express";
import { IAdminAddCategoryUsecase } from "../../../../Application/admin/interfaces/category/iAddCategory.admin.usecase";
import { addCategorySchema } from "../../validators/categoryValidator";
import { AdminAddCategoryInputDTO } from "../../../../Application/admin/dtos/category/category.add.dto";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { categoryMessages } from "../../../../Shared/constsnts/messages/categoryMessages";

export class CategoryController {
    constructor(
        private _addCategory: IAdminAddCategoryUsecase,
    ) {}

    addCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = addCategorySchema.parse(req.body)
            const payload: AdminAddCategoryInputDTO = {
                name: parsed.name,
                parentId: parsed.parent
            }

            const category = await this._addCategory.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: categoryMessages.success.CATEGORY_ADDED_SUCCESSFULLY,
                category
            })
        } catch (error) {
            next(error)
        }
    }
}