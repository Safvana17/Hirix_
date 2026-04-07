import { NextFunction, Request, Response } from "express";
import { IAdminAddCategoryUsecase } from "../../../../Application/admin/interfaces/category/iAddCategory.admin.usecase";
import { getAllCategorySchema } from "../../validators/categoryValidator";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { categoryMessages } from "../../../../Shared/constsnts/messages/categoryMessages";
import { IGetAllCategoriesUsecase } from "../../../../Application/admin/interfaces/category/iGetAllCategory.admin.usecase";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { IAdminDeleteCategoryUsecase } from "../../../../Application/admin/interfaces/category/iDeleteCategory.admin.usecase";
import { sendSuccess } from "../../utils/apiResponse";
import { IAdminEditCategoryUsecase } from "../../../../Application/admin/interfaces/category/iEditCategory.admin.usecase";

export class CategoryController {
    constructor(
        private _addCategory: IAdminAddCategoryUsecase,
        private _getAllCategories: IGetAllCategoriesUsecase,
        private _deleteCategory: IAdminDeleteCategoryUsecase,
        private _editCategory: IAdminEditCategoryUsecase
    ) {}

    addCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const category = await this._addCategory.execute(req.body)
        return sendSuccess(res, statusCode.OK, categoryMessages.success.CATEGORY_ADDED_SUCCESSFULLY,{category})
    })

    getAllCategory = asyncHandler( async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const parsed = getAllCategorySchema.parse(req.query)
        const {categories, totalCount, totalPages} = await this._getAllCategories.execute(parsed)
        return sendSuccess(res, statusCode.OK, "", {categories,totalCount,totalPages})
    })

    deleteCategory = asyncHandler(async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
            const categoryId = Array.isArray(req.params.id)
                  ? req.params.id[0]
                  : req.params.id
            const deletedCategory = await this._deleteCategory.execute({id:categoryId})
            return sendSuccess(res, statusCode.OK, categoryMessages.success.CATEGORY_DELETED_SUCCESSFULLY, deletedCategory)
    })
    editCategory = asyncHandler( async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const categoryId = Array.isArray(req.params.id)
              ? req.params.id[0]
              : req.params.id
        const updatedCategory = await this._editCategory.execute({...req.body, id: categoryId})
        return sendSuccess(res, statusCode.OK, categoryMessages.success.CATEGORY_UPDATED_SUCCESSFULLY, updatedCategory)
    })
}