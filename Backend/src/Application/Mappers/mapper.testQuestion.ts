import { Types } from "mongoose";
import { TestQuestionEntity } from "../../Domain/entities/TestQuestion.entity";
import { ITestQuestion } from "../../Infrastructure/database/Model/TestQuestion";

export class TestQuestionMapper {
    static toEntity(doc: ITestQuestion): TestQuestionEntity{
        const testQuestion = new TestQuestionEntity(
            doc._id.toString(),
            doc.source,
            doc.type,
            doc.title,
            doc.order,
            doc.mark,
            doc.questionId.toString(),
            doc.description,
            doc.options,
            doc.answer,
            doc.testCase
        )

        return testQuestion
    }

    static toPersistence(entity: TestQuestionEntity) {
        return {
            source: entity.source,
            type: entity.type,
            title: entity.title,
            order: entity.order,
            mark: entity.mark,
            questionId: new Types.ObjectId(entity.questionId),
            description: entity.description,
            options: entity.options,
            answer: entity.answer,
            testCase: entity.testCase
        }
    }
}