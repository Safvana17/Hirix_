import { CategoryEntity } from "../entities/Category.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ICategoryRepository extends IBaseRepository<CategoryEntity> {
    // findAllFiltered(query: {search?: string, status?: string, page: number, limit: number}): Promise<{data: CategoryEntity[], totalPages: number, totalCount: number}> 
    findByNameAndParent(name: string, parent: string | null): Promise<CategoryEntity | null>
}