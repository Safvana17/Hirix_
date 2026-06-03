import { Types } from "mongoose";
import { TestCandidateMapper } from "../../Application/Mappers/mapper.testCandidate";
import { TestCandidateEntity } from "../../Domain/entities/TestCandidate.entity";
import { CandidatePipelineStatus, CandidateTestStatus } from "../../Domain/enums/Test";
import { ITestCandidateRepository } from "../../Domain/repositoryInterface/iTestCandidate.repository";
import { logger } from "../../utils/logging/loger";
import { ITestCandidate, TestCandidateModel } from "../database/Model/TestCandidate";
import { BaseRepository } from "./base.repository";

export class TestCandidateRepository extends BaseRepository<TestCandidateEntity, ITestCandidate> implements ITestCandidateRepository{
    constructor() {
        super(TestCandidateModel)
    }

    async findByTestLink(testLink: string): Promise<TestCandidateEntity | null> {
        const document = await this._model.findOne({testLink})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findByTestId(testId: string): Promise<TestCandidateEntity[] | null> {
        const documents = await this._model.find({testId})
        if(!documents) return null
        return documents.map( d => this.mapToEntity(d) )
    }

    async countByTestIds(testId: string): Promise<number> {
        return this._model.countDocuments({testId})
    }

    async findByToken(token: string): Promise<TestCandidateEntity | null> {
        const document = await this._model.findOne({testToken: token})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findByEmail(email: string): Promise<TestCandidateEntity | null> {
        const document = await this._model.findOne({email})
        if(!document) return null
        return this.mapToEntity(document)
    }
    
    async getCandidateActivity(startDate: Date): Promise<{ attendedCandidates: number; notAttendedCandidates: number; month: string; }[]> {
        return await this._model.aggregate([
            {
                $match: {
                    createdAt: { $gt: startDate}
                }
            }, 
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt"},
                        month: { $month: "$createdAt"}
                    },
                    attendedCandidates: {
                        $sum: {
                            $cond: [{ $eq: ["$candidateTestStatus", CandidateTestStatus.SUBMITTED]}, 1, 0]
                        }
                    },
                    notAttendedCandidates: {
                        $sum: {
                            $cond: [{ $ne: ["$candidateTestStatus", CandidateTestStatus.SUBMITTED]},1, 0]
                        }
                    }
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
                    attendedCandidates: 1,
                    notAttendedCandidates: 1
                }
            }
        ])
    }

    async getHiredCandidatesByCompany(companyId: string): Promise<number> {
        const totalHiredCandidates = await this._model.aggregate([
            {
                $lookup: {
                    from: 'tests',
                    localField: 'testId',
                    foreignField: '_id',
                    as: 'test'
                }
            },
            {
                $unwind: '$test'
            },
            {
                $match: {
                    'test.companyId': new Types.ObjectId(companyId),
                    selectionStatus: CandidatePipelineStatus.OFFER_SENT
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1}
                }
            }
        ])
        logger.info(totalHiredCandidates, 'from repo')
        return totalHiredCandidates[0]?.count ?? 0
    }

    async getTestTrendByCompany(companyId: string, startDate: Date): Promise<{ month: string; attendedCandidates: number; }[]> {
        const trend = await this._model.aggregate([
            {
                $lookup: {
                    from: 'tests',
                    localField: 'testId',
                    foreignField: '_id',
                    as: 'test'
                }
            },
            {
                $unwind: '$test'
            },
            {
                $match: {
                    'test.companyId': new Types.ObjectId(companyId),
                    createdAt: { $gt: startDate},
                    candidateTestStatus: { $in: [CandidateTestStatus.IN_PROGRESS, CandidateTestStatus.SUBMITTED]}
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt"},
                        month: {$month: "$createdAt"},
                    },
                    attendedCandidates: { $sum: 1}
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
                    attendedCandidates: 1
                }
            }
        ])

        return trend
    }

    protected mapToEntity(doc: ITestCandidate): TestCandidateEntity {
        return TestCandidateMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: TestCandidateEntity): Partial<ITestCandidate> {
        return TestCandidateMapper.toPersistence(entity)
    }
}