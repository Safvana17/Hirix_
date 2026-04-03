import { QueryFilter, Types } from "mongoose";
import { CategoryMapper } from "../../Application/Mappers/mapper.category";
import { CategoryEntity } from "../../Domain/entities/Category.entity";
import { ICategoryRepository } from "../../Domain/repositoryInterface/iCategory.repository";
import { CategoryModel, ICategory } from "../database/Model/Category";
import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository<CategoryEntity, ICategory> implements ICategoryRepository {
    constructor(){
        super(CategoryModel)
    }

    async findByNameAndParent(name: string, parent: string | null): Promise<CategoryEntity | null> {
        const category = await this._model.findOne({
            name: {$regex: `${name}`, $options: "i"},
            parentId: parent === null ? null : new Types.ObjectId(parent),
        })
        if(!category) return null
        return this.mapToEntity(category)
    }

    async findAllFiltered(query: { page: number; limit: number; }): Promise<{ data: CategoryEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<ICategory> = {
            parentId: null,
            isDeleted: false
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages =Math.ceil(totalCount / query.limit)

        const rootDocuments = await this._model
               .find(filter)
               .skip(skip)
               .sort({ createdAt: -1 })
               .limit(query.limit)
        const rootIds = rootDocuments.map(doc => doc._id)   
        const childrenDocuments = await this._model.find({
            parentId: {$in: rootIds},
            isDeleted: false
        }) 

        const allDocs = [...rootDocuments, ...childrenDocuments]
        return {
            data: allDocs.map(doc => this.mapToEntity(doc)),
            totalPages,
            totalCount
        }
    }

    async hasChildren(categoryId: string): Promise<boolean> {
        
        const count = await this._model.countDocuments({
            $and:
              [
                {parentId: categoryId},
                { isDeleted: false}
              ]
        })
        return count > 0
    }

    async exists(categoryId: string): Promise<boolean> {
        const document = await this._model.exists({ _id: categoryId })
        return !!document
    }

    protected mapToEntity(doc: ICategory): CategoryEntity {
        return CategoryMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: CategoryEntity): Partial<ICategory> {
        return CategoryMapper.toPersistance(entity)
    }
}