import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { GetAllCategoryOutputDTO } from "../../dtos/category/category.getAll.dto";
import { IGetAllCategoriesUsecase } from "../../interfaces/category/iGetAllCategory.admin.usecase";

export class GetAllCategoryUsecase implements IGetAllCategoriesUsecase {
    constructor(
        private _categoryRepository: ICategoryRepository
    ) {}

    /**
     * 
     * @returns all categories with id, name, parentid and is deleted or not flag
     */

    async execute(): Promise<GetAllCategoryOutputDTO> {
        const data = await this._categoryRepository.findAllFiltered()

        return {
            categories: data.map((c) => ({
                id: c.id,
                name: c.name,
                parentId: c.parentId,
                isDeleted: c.isDeleted
            }))
        }
    }
}