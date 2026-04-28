import { Types } from "mongoose";
import { TestEntity } from "../../Domain/entities/Test.entity";
import { ITest } from "../../Infrastructure/database/Model/Test";

export class TestMapper {
    static toEntity(doc: ITest): TestEntity {
        const test = new TestEntity(
            doc._id.toString(),
            doc.name,
            doc.companyId.toString(),
            doc.jobRoleId.toString(),
            doc.description,
            doc.startTime,
            doc.endTime,
            doc.rules,
            doc.testStatus
        )

        return test
    }

    static toPersistence(entity: TestEntity){
        return {
            name: entity.name,
            companyId: new Types.ObjectId(entity.companyId),
            jobRoleId: new Types.ObjectId(entity.jobRoleId),
            description: entity.description,
            startTime: entity.startTime,
            endTime: entity.endTime,
            rules: entity.rules,
            testStatus: entity.testStatus
        }
    }
}