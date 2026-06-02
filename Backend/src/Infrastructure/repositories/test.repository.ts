import { QueryFilter, Types } from "mongoose";
import { TestMapper } from "../../Application/Mappers/mapper.companyTest";
import { TestEntity } from "../../Domain/entities/Test.entity";
import { TestStatus } from "../../Domain/enums/Test";
import { CompanyTestList, ITestRepository } from "../../Domain/repositoryInterface/iTest.repository";
import { ITest, TestModel } from "../database/Model/Test";
import { BaseRepository } from "./base.repository";

export class TestRepository extends BaseRepository<TestEntity, ITest> implements ITestRepository {
    constructor(){
       super(TestModel)
    }

    async findByCompanyId(companyId: string): Promise<TestEntity | null> {
        const document = await this._model.findOne({companyId})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findByName(name: string, companyId: string): Promise<TestEntity | null> {
        const document = await this._model.findOne({
            name, 
            companyId,
            testStatus: TestStatus.PUBLISHED
        })
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findByJobroleId(jobRoleId: string, companyId: string): Promise<TestEntity | null> {
        const document = await this._model.findOne({jobRoleId, companyId, testStatus: TestStatus.PUBLISHED})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findAllFiltered(query: { companyId: string, search?: string; status?: TestStatus; page: number; limit: number; }): Promise<{ data: CompanyTestList[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<ITest> = {
            companyId: query.companyId,
            isDeleted: false
            
        }
        if(query.search){
            filter.$or = [
                {name: { $regex: query.search, $options: "i"}},
            ]
        }
        if(query.status){
            filter.testStatus = query.status
        }

        const skip = (query.page - 1) * (query.limit)
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount/query.limit)

        const documents = await this._model.find(filter)
                .sort({createdAt: -1})
                .populate<{jobRoleId: {_id: Types.ObjectId; name: string}}>('jobRoleId', 'name')
                .skip(skip)
                .limit(query.limit)
        return {
            data: documents.map((doc) => ({
                id: doc._id.toString(),
                name: doc.name,
                jobRole: {
                    id: doc.jobRoleId._id.toString(),
                    name: doc.jobRoleId.name
                },
                startTime: doc.startTime,
                endTime: doc.endTime,
                testStatus: doc.testStatus,
                isDeleted: doc.isDeleted
            })),
            totalCount,
            totalPages
        }
    }

    async CountTestInMonth(companyId: string, startOfMonth: Date, endOfMonth: Date): Promise<number> {
        return await this._model.countDocuments({
            companyId,
            createdAt: {
                $gt: startOfMonth,
                $lt: endOfMonth
            },
            testStatus: {
                $nin: [TestStatus.DELETED, TestStatus.CANCELLED]
            }
        })
    }
    
    async getTotalTests(): Promise<number> {
        const totalTests = await this._model.aggregate([
            {
                $match: {
                    isDeleted: false,
                    testStatus: { $ne: TestStatus.CANCELLED}
                }
            }, 
            {
                $group: {
                    _id: null,
                    count: { $sum: 1}
                }
            }
        ])
        return totalTests[0].count ?? 0
    }

    async getTestActivity(startDate: Date): Promise<{ month: string; testTrend: number; }[]> {
        return await this._model.aggregate([
            {
                $match: {
                    isDeleted: false,
                    createdAt: { $gt: startDate}
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt"},
                        month: {$month: "$createdAt"}
                    },
                    testTrend: { $sum: 1}
                }
            },
            {
                $sort: {
                    "_id.year": -1,
                    "_id.month": -1
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                       $dateToString: {
                          format: "%b",
                          date: {
                             $dateFromParts: {
                                year: "$_id.year",
                                month: "$_id.month"
                             }
                          }
                       }
                    },
                    testTrend: 1
                }
            }
        ])
    }

    async getTotalTestByCompany(companyId: string): Promise<number> {
        return this._model.countDocuments({companyId, testStatus: { $nin: [TestStatus.CANCELLED, TestStatus.DELETED]}})
    }
    
    protected mapToEntity(doc: ITest): TestEntity {
        return TestMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: TestEntity): Partial<ITest> {
        return TestMapper.toPersistence(entity)
    }

}