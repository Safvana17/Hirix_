import { CategoryEntity } from "../../../../Domain/entities/Category.entity";
import { AppError } from "../../../../Domain/errors/app.error";
import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { categoryMessages } from "../../../../Shared/constsnts/messages/categoryMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { AdminAddCategoryInputDTO, AdminAddCategoryOutputDTO } from "../../dtos/category/category.add.dto";
import { IAdminAddCategoryUsecase } from "../../interfaces/category/iAddCategory.admin.usecase";

export class AdminAddCategoryUsecase implements IAdminAddCategoryUsecase{
    constructor(
        private _categoryRepository: ICategoryRepository
    ) {}


    /**
     * 
     * @param request - category name and parentId(optional)
     * @returns - newly created category
     */
    async execute(request: AdminAddCategoryInputDTO): Promise<AdminAddCategoryOutputDTO> {
       let parentId: string | null = null

       if(request.parentId){
            const parent = await this._categoryRepository.findById(request.parentId)
            if(!parent){
                throw new AppError(categoryMessages.error.PARENT_NOT_FOUND, statusCode.NOT_FOUND)
            }
            if(parent.isDeleted){
                throw new AppError(categoryMessages.error.DELETED_CATEGORY, statusCode.BAD_REQUEST)
            }
            logger.info({parentfromusecae: parent})
            parentId = parent.id
       }

       const isExisting = await this._categoryRepository.findByNameAndParent(request.name, parentId)
            if(isExisting){
                if(isExisting.isDeleted){
                    isExisting.isDeleted = false
                    isExisting.parentId = parentId
                    const savedCategory = await this._categoryRepository.update(isExisting.id, isExisting)
                    if(!savedCategory){
                        throw new AppError(categoryMessages.error.UPDATE_CATEGORY_FAILED, statusCode.SERVER_ERROR)
                    }
                    return {
                        id: savedCategory.id,
                        name: savedCategory.name,
                        haveParent: !!savedCategory.parentId
                    }
                }else{
                    throw new AppError(categoryMessages.error.ALREADY_EXISITING, statusCode.CONFLICT)
                }
            }

       const newCategory = new CategoryEntity(
         "",
         request.name,
         false,
         parentId
       )

       const savedCategory = await this._categoryRepository.create(newCategory)
       return {
        id: savedCategory.id,
        name: savedCategory.name,
        haveParent: !!savedCategory.parentId
       }
    }
}