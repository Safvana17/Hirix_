import { CategoryEntity } from "../entities/Category.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ICategoryRepository extends IBaseRepository<CategoryEntity> {
    findAllFiltered(query: {page: number, limit: number}): Promise<{data: CategoryEntity[], totalPages: number, totalCount: number}>   
    findByNameAndParent(name: string, parent: string | null): Promise<CategoryEntity | null>
    hasChildren(categoryId: string): Promise<boolean>
    exists(categoryId: string): Promise<boolean>
}