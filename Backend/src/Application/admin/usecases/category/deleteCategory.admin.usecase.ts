import { AppError } from "../../../../Domain/errors/app.error";
import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { categoryMessages } from "../../../../Shared/constsnts/messages/categoryMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminDeleteCategoryInputDTO, AdminDeleteCategoryOutputDTO } from "../../dtos/category/category.delete.dto";
import { IAdminDeleteCategoryUsecase } from "../../interfaces/category/iDeleteCategory.admin.usecase";

export class AdminDeleteCategoryUsecase implements IAdminDeleteCategoryUsecase{
    constructor(
        private _categoryRepository: ICategoryRepository
    ) {}

    async execute(request: AdminDeleteCategoryInputDTO): Promise<AdminDeleteCategoryOutputDTO> {
        const category = await this._categoryRepository.findById(request.id)
        if(!category){
            throw new AppError(categoryMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        const hasChildren = await this._categoryRepository.hasChildren(category.id)
        if(hasChildren){
            throw new AppError(categoryMessages.error.CANNOT_DELETE_cATEGORY_WITH_CHILDREN, statusCode.BAD_REQUEST)
        }
        category.isDeleted = true
        await this._categoryRepository.update(category.id, category)
        return {
            id: category.id,
            success: true
        }
    }
}