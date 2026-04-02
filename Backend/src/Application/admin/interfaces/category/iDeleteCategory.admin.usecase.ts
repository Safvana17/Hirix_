import { AdminDeleteCategoryInputDTO, AdminDeleteCategoryOutputDTO } from "../../dtos/category/category.delete.dto";

export interface IAdminDeleteCategoryUsecase {
    execute(request: AdminDeleteCategoryInputDTO): Promise<AdminDeleteCategoryOutputDTO>
}