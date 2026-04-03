import { Types } from "mongoose";
import { CategoryEntity } from "../../Domain/entities/Category.entity";
import { ICategory } from "../../Infrastructure/database/Model/Category";


export class CategoryMapper {
    static toEntity(doc: ICategory): CategoryEntity {
        const category = new CategoryEntity(
            doc._id.toString(),
            doc.name,
            doc.isDeleted,
            doc.parentId ? doc.parentId.toString() : null
        )

        return category
    }

    static toPersistance(entity: CategoryEntity){
        return {
            name: entity.name,
            isDeleted: entity.isDeleted,
            parentId: entity.parentId 
                ? new Types.ObjectId(entity.parentId)
                : null
        }
    }
}