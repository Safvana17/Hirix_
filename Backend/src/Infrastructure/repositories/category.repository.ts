import { Types } from "mongoose";
import { CategoryMapper } from "../../Application/Mappers/mapper.category";
import { CategoryEntity } from "../../Domain/entities/Category.entity";
import { ICategoryRepository } from "../../Domain/repositoryInterface/iCategory.repository";
import { CategoryModel, ICategory } from "../database/Model/category";
import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository<CategoryEntity, ICategory> implements ICategoryRepository {
    constructor(){
        super(CategoryModel)
    }

    async findByNameAndParent(name: string, parent: string | null): Promise<CategoryEntity | null> {
        const category = await this._model.findOne({
            name: {$regex: `${name}`, $options: "i"},
            parentId: parent === null ? null : new Types.ObjectId(parent),
            isDeleted: false
        })
        if(!category) return null
        return this.mapToEntity(category)
    }

    // async findAllFiltered(query: { search?: string; status?: string; page: number; limit: number; }): Promise<{ data: CategoryEntity[]; totalPages: number; totalCount: number; }> {
        
    // }

    protected mapToEntity(doc: ICategory): CategoryEntity {
        return CategoryMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: CategoryEntity): Partial<ICategory> {
        return CategoryMapper.toPersistance(entity)
    }
}