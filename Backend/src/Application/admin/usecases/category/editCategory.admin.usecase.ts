import { AppError } from "../../../../Domain/errors/app.error";
import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { categoryMessages } from "../../../../Shared/constsnts/messages/categoryMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminEditCategoryInputDTO, AdminEditCategoryOutputDTO } from "../../dtos/category/category.edit.dto";
import { IAdminEditCategoryUsecase } from "../../interfaces/category/iEditCategory.admin.usecase";

export class AdminEditCategoryUsecase implements IAdminEditCategoryUsecase {
    constructor(
        private _categoryRepository: ICategoryRepository
    ) {}

    async execute(request: AdminEditCategoryInputDTO): Promise<AdminEditCategoryOutputDTO> {

        const category = await this._categoryRepository.findById(request.id)
        if(!category){
            throw new AppError(categoryMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(category.isDeleted){
            throw new AppError(categoryMessages.error.DELETED_CATEGORY, statusCode.BAD_REQUEST)
        }
        let parentId: string  | null = null

        if(request.parentId){
            const parent = await this._categoryRepository.findById(request.parentId)
            if(!parent){
                throw new AppError(categoryMessages.error.PARENT_NOT_FOUND, statusCode.NOT_FOUND)
            }
            if(parent.id === category.id){
                throw new AppError(categoryMessages.error.SAME_CATEGORY_AND_PARENT_cATEGORY, statusCode.BAD_REQUEST)
            }
            if(parent.isDeleted){
                throw new AppError(categoryMessages.error.DELETED_PARENT_CATEGORY, statusCode.NOT_FOUND)
            }

            const isInValid = await this._categoryRepository.isDescendant(category.id, parent.id)
            if(isInValid){
                throw new AppError(categoryMessages.error.SAME_PARENT_AND_CHILD, statusCode.BAD_REQUEST)
            }
            parentId = parent.id
        }

        const isExisting = await this._categoryRepository.findByNameAndParent(request.name, parentId)
        if(isExisting && request.id !== isExisting.id){
            throw new AppError(categoryMessages.error.ALREADY_EXISITING, statusCode.CONFLICT)
        }

        category.name = request.name
        category.parentId = parentId
        const updatedCategory = await this._categoryRepository.update(category.id, category)
        if(!updatedCategory){
            throw new AppError(categoryMessages.error.UPDATE_CATEGORY_FAILED, statusCode.SERVER_ERROR)
        }
        return {
            id: updatedCategory.id,
            name: updatedCategory.name,
            parentId: updatedCategory.parentId,
            isDeleted: updatedCategory.isDeleted
        }
    }
}