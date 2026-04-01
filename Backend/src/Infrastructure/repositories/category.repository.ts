import { QueryFilter, Types } from "mongoose";
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

    async findAllFiltered(): Promise<CategoryEntity[]> {
    //    const filter: QueryFilter<ICategory> = {}

    //     const skip = (query.page - 1) * query.limit
    //     const totalCount = await this._model.countDocuments(filter)
    //     const totalPages =Math.ceil(totalCount / query.limit)

        const documents = await this._model
               .find({ isDeleted: false })
               .sort({ createdAt: -1 })
             

        return documents.map(doc => this.mapToEntity(doc)) 
    }

    protected mapToEntity(doc: ICategory): CategoryEntity {
        return CategoryMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: CategoryEntity): Partial<ICategory> {
        return CategoryMapper.toPersistance(entity)
    }
}