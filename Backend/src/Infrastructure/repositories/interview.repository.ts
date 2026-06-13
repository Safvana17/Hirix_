import mongoose, { QueryFilter } from "mongoose";
import { InterviewMapper } from "../../Application/Mappers/mapper.interview";
import { InterviewEntity } from "../../Domain/entities/Interview";
import { InterviewStatus } from "../../Domain/enums/interview";
import { IInterviewRepository } from "../../Domain/repositoryInterface/iInterview.repository";
import { IInterview, InterviewModel } from "../database/Model/Interview";
import { BaseRepository } from "./base.repository";
import { InterviewDTO } from "../../Application/company/dtos/interview/company.getAllInterviews.dto";
import { InterviewHistoryDTO } from "../../Application/candidate/dtos/profile/candidate.interviewHistory.dto";

export class InterviewRepository extends BaseRepository<InterviewEntity, IInterview> implements IInterviewRepository {
    constructor() {
        super(InterviewModel)
    }
    
    async findByToken(token: string): Promise<InterviewEntity | null> {
        const document = await this._model.findOne({candidateToken: token})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findScheduledInterview(testCandidateId: string, round: number): Promise<InterviewEntity | null> {
        const document = await this._model.findOne({
            testCandidateId, 
            round, 
            interviewStatus : {$ne: InterviewStatus.CANCELLED}
        })
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findAllFiltered(query: {companyId: string, search?: string; status?: InterviewStatus; page: number; limit: number; }): Promise<{ data: InterviewDTO[]; totalCount: number; totalPages: number; }> {
        const filter: QueryFilter<IInterview> = {
            companyId: new mongoose.Types.ObjectId(query.companyId)
        }

        if(query.search){
            filter.$or = [
                {name: { $regex: query.search, $options: "i"}},
                {interviewerName: { $regex: query.search, $options: "i"}},
                {candidateName: {$regex: query.search, $options: "i"}}
            ]
        }
        if(query.status){
            filter.interviewStatus = query.status
        }

        const skip = (query.page - 1) * query.limit
        // const totalCount = await this._model.countDocuments(filter)
        // const totalPages = Math.ceil(totalCount/ query.limit)

        // const documents = await this._model.find(filter)
        //         .sort({createdAt: -1})
        //         .skip(skip)
        //         .limit(query.limit)

        // return {
        //     data: documents.map(d => this.mapToEntity(d)),
        //     totalCount,
        //     totalPages
        // }
const document = await this._model.aggregate([
  {
    $match: filter
  }
])

console.log('documents:', document.length)
        const documents = await this._model.aggregate([
            {
                $match: filter
            },
            {
                $lookup: {
                    from: 'interviews',
                    let: {
                        testCandidateId: '$testCandidateId',
                        currentRound: '$round',
                        companyId: '$companyId'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: [
                                                '$testCandidateId',
                                                '$$testCandidateId'
                                            ]
                                        },
                                        {
                                            $eq: [
                                                '$round',
                                                {
                                                   $add: ['$$currentRound', 1] 
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $limit: 1
                        }
                    ],
                    as: 'nextRound'
                }
            },
            {
                $addFields: {
                    hasNextRound: {
                        $gt: [
                            {$size: '$nextRound'},
                            0
                        ]
                    }
                }
            },
            {
                $project: {
                    nextRound: 0
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: query.limit
            }
        ])

        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount/query.limit)
        return {
            data: documents,
            totalCount,
            totalPages
        }
    }

    async findByRoomId(roomId: string): Promise<InterviewEntity | null> {
        const document = await this._model.findOne({roomId})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async getTotalInterviewsByCompany(companyId: string): Promise<number> {
        return this._model.countDocuments({companyId, interviewStatus: { $ne: InterviewStatus.CANCELLED}})
    }

    async getInterviewUsage(): Promise<{ company: string; count: number; }[]> {
        return await this._model.aggregate([
            {
                $group: {
                    _id: "$companyId",
                    count: { $sum: 1}
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            {
                $unwind: {
                    path: "$company",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    count: 1,
                    company: "$company.name"
                }
            }
        ])
    }
    
    async getInterviewHistory(query: { email: string; page: number; limit: number; }): Promise<{ history: InterviewHistoryDTO[]; totalPages: number; totalCount: number; }> {
        const skip = query.limit * (query.page - 1)
        const totalCount = await this._model.countDocuments({candidateEmail: query.email})
        const totalPages = Math.ceil(totalCount / query.limit)
        const documents = await this._model.aggregate([
            {
                $match: {
                    candidateEmail: query.email
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'Company'
                }
            },
            {
                $lookup: {
                    from: 'jobroles',
                    localField: 'jobRoleId',
                    foreignField: '_id',
                    as: 'JobRole'
                }
            },
            {
                $unwind: {
                    path: '$Company',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: '$JobRole',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    companyName: '$Company.name',
                    interviewName: '$name',
                    jobRole: '$JobRole.name',
                    interviewerName: '$interviewerName',
                    status: '$result',
                    createdAt: 1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: query.limit
            }
        ])
        return {
            history: documents,
            totalCount,
            totalPages
        }
    }

    protected mapToEntity(doc: IInterview): InterviewEntity {
        return InterviewMapper.mapToEntity(doc)
    }
    protected mapToPersistance(entity: InterviewEntity): Partial<IInterview> {
        return InterviewMapper.mapToPersistance(entity)
    }
}