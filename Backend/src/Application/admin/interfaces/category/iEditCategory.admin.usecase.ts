import { AdminEditCategoryInputDTO, AdminEditCategoryOutputDTO } from "../../dtos/category/category.edit.dto";

export interface IAdminEditCategoryUsecase {
    execute(request: AdminEditCategoryInputDTO): Promise<AdminEditCategoryOutputDTO>
}