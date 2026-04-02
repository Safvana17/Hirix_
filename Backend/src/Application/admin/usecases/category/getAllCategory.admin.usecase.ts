import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { getAllCategoryInputDTO, PaginatedCategoryDTO } from "../../dtos/category/category.getAll.dto";
import { IGetAllCategoriesUsecase } from "../../interfaces/category/iGetAllCategory.admin.usecase";

export class GetAllCategoryUsecase implements IGetAllCategoriesUsecase {
    constructor(
        private _categoryRepository: ICategoryRepository
    ) {}

    /**
     * 
     * @returns all categories with id, name, parentid and is deleted or not flag
     */

    async execute(request: getAllCategoryInputDTO): Promise<PaginatedCategoryDTO> {
        const {data, totalCount, totalPages} = await this._categoryRepository.findAllFiltered(request)

        return {
            categories: data.map((c) => ({
                id: c.id,
                name: c.name,
                parentId: c.parentId,
                isDeleted: c.isDeleted
            })),
            totalCount,
            totalPages
        }
    }
}