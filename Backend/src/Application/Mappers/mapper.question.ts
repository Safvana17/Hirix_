import { Types } from "mongoose";
import { QuestionEntity } from "../../Domain/entities/Question.entity";
import { IQuestion } from "../../Infrastructure/database/Model/Question";

export class QuestionMapper {
    static toEntity(doc: IQuestion): QuestionEntity {
        
        const question = new QuestionEntity (
            doc._id.toString(),
            doc.title,
            doc.description,
            doc.type,
            doc.difficulty,
            doc.categoryId.toString(),
            doc.createdBy,
            doc.visibility,
            doc.isPremium,
            doc.isPractice,
            doc.isDeleted,
            doc.answer,
            doc.options,
            doc.testCases?.map(tc => {
                try {
                    return JSON.parse(tc)
                } catch {
                    return tc
                }
            }),
            doc.createdById ? doc.createdById.toString() : null
        )

        let categoryName: string | undefined = undefined

if (doc.categoryId && typeof doc.categoryId === 'object' && 'name' in doc.categoryId) {
  categoryName = (doc.categoryId as { name: string }).name
}
        question.categoryName = categoryName
        return question
    }

    static toPersistence(entity: QuestionEntity){
        return {
            title: entity.title,
            description: entity.description,
            type: entity.type,
            difficulty: entity.difficulty,
            categoryId: new Types.ObjectId(entity.categoryId),
            createdBy: entity.createdBy,
            visibility: entity.visibility,
            isPremium: entity.isPremium,
            isPractice: entity.isPractice,
            isDeleted: entity.isDeleted,
            answer: entity.answer,
            options: entity.options,
            testCases: entity.testCases?.map(tc => 
                JSON.stringify(tc)
            ),
            createdById: entity.createdById
                ? new Types.ObjectId(entity.createdById)
                : null
            
        }
    }
}