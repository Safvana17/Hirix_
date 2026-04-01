import { GetAllCategoryOutputDTO } from "../../dtos/category/category.getAll.dto";

export interface IGetAllCategoriesUsecase {
    execute(): Promise<GetAllCategoryOutputDTO>
}