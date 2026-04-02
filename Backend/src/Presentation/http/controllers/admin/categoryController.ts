import { NextFunction, Request, Response } from "express";
import { IAdminAddCategoryUsecase } from "../../../../Application/admin/interfaces/category/iAddCategory.admin.usecase";
import { addCategorySchema } from "../../validators/categoryValidator";
import { AdminAddCategoryInputDTO } from "../../../../Application/admin/dtos/category/category.add.dto";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { categoryMessages } from "../../../../Shared/constsnts/messages/categoryMessages";
import { IGetAllCategoriesUsecase } from "../../../../Application/admin/interfaces/category/iGetAllCategory.admin.usecase";
import { logger } from "../../../../utils/logging/loger";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { IAdminDeleteCategoryUsecase } from "../../../../Application/admin/interfaces/category/iDeleteCategory.admin.usecase";
import { sendSuccess } from "../../utils/apiResponse";

export class CategoryController {
    constructor(
        private _addCategory: IAdminAddCategoryUsecase,
        private _getAllCategories: IGetAllCategoriesUsecase,
        private _deleteCategory: IAdminDeleteCategoryUsecase
    ) {}

    addCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
            logger.info({req: req.body})
            const parsed = addCategorySchema.parse(req.body)
            const payload: AdminAddCategoryInputDTO = {
                name: parsed.name,
                parentId: parsed.parentId
            }
            logger.info({payload: payload})
            const category = await this._addCategory.execute(payload)

            return res.status(statusCode.OK).json({
                success: true,
                message: categoryMessages.success.CATEGORY_ADDED_SUCCESSFULLY,
                category
            })
    })

    getAllCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {categories} = await this._getAllCategories.execute()
            return res.status(statusCode.OK).json({
                success: true,
                categories
            })
        } catch (error) {
            next(error)
        }
    }

    deleteCategory = asyncHandler(async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
            const categoryId = Array.isArray(req.params.id)
                  ? req.params.id[0]
                  : req.params.id
            const deletedCategory = await this._deleteCategory.execute({id:categoryId})
            return sendSuccess(res, statusCode.OK, categoryMessages.success.CATEGORY_DELETED_SUCCESSFULLY, deletedCategory)
    })
}