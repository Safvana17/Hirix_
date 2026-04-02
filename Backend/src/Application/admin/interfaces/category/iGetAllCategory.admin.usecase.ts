import { getAllCategoryInputDTO, PaginatedCategoryDTO } from "../../dtos/category/category.getAll.dto";

export interface IGetAllCategoriesUsecase {
    execute(Request: getAllCategoryInputDTO): Promise<PaginatedCategoryDTO>
}