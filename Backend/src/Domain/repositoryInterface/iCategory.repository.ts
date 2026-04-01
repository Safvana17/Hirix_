import { CategoryEntity } from "../entities/Category.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ICategoryRepository extends IBaseRepository<CategoryEntity> {
    findAllFiltered(): Promise<CategoryEntity[]> 
    findByNameAndParent(name: string, parent: string | null): Promise<CategoryEntity | null>
}