import { AdminAddCategoryInputDTO, AdminAddCategoryOutputDTO } from "../../dtos/category/category.add.dto"

export interface IAdminAddCategoryUsecase {
    execute(request: AdminAddCategoryInputDTO): Promise<AdminAddCategoryOutputDTO>
}