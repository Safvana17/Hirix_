import { QueryFilter } from "mongoose";
import { PaymentMapper } from "../../Application/Mappers/mapper.payment";
import { PaymentEntity } from "../../Domain/entities/Payment.entity";
import { PaymentStatus } from "../../Domain/enums/payment";
import { IPaymentRepository } from "../../Domain/repositoryInterface/iPayment.repository";
import { IPayment, PaymentModel } from "../database/Model/Payment";
import { BaseRepository } from "./base.repository";
import { TargetType } from "../../Domain/enums/subscription";
import { logger } from "../../utils/logging/loger";

export class PaymentRepository extends BaseRepository<PaymentEntity, IPayment> implements IPaymentRepository {
    constructor(){
        super(PaymentModel)
    }

    async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
        const document = await this._model.findOne({orderId})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findOrderByOwner(ownerId: string): Promise<PaymentEntity[] | null> {
        const documents = await this._model.find({ownerId})
        if(!documents) return null
        return documents.map(d => this.mapToEntity(d))
    }

    async findAllFiltered(query: { userId: string; status?: PaymentStatus; page: number; limit: number; }): Promise<{ data: PaymentEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<IPayment> = {
            ownerId: query.userId
        }

        if(query.status){
            filter.status = query.status
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount/query.limit) 

        const documents = await this._model
              .find(filter)
              .sort({createdAt: -1})
              .skip(skip)
              .limit(query.limit)
        return {
            data: documents.map(d => this.mapToEntity(d)),
            totalCount,
            totalPages
        }
    }

    async getTotalRevenue(): Promise<number> {
        const totalRevenue = await this._model.aggregate([
            {
                $match: {
                    status: 'success'
                }, 
            }, {
                $group: {
                    _id: null,
                    sum: { $sum: '$amount'}
                }
            }
        ])
        return totalRevenue[0]?.sum ?? 0
    }

    async getMonthlyRevenue(): Promise<number> {
        const monthlyRevenue = await this._model.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: {
                        $gt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        $lt: new Date(new Date().getFullYear(), new Date().getMonth()+1, 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    revenue: { $sum: "$amount"}
                }
            }
        ])

        return monthlyRevenue[0]?.revenue ?? 0
    }

    async getRevenueTrendByMonth(startDate: Date): Promise<{ month: string; revenue: number; }[]> {
        return await this._model.aggregate([
            {
                $match: {
                    createdAt: { $gt: startDate },
                    status: 'success'
                }
            }, 
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt"},
                        month: { $month: "$createdAt"}
                    },
                    revenue: { $sum: "$amount"}
                }
            }, 
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
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
                    revenue: 1
                }
            }
        ])
    }

    async getRevenueTrendByPlan(type?: TargetType): Promise<{ plan: string; type: TargetType; revenue: number; }[]> {
        const filter: QueryFilter<IPayment> = {
            status: PaymentStatus.SUCCESS
        }
        if(type){
            filter.ownerType = type
        } 

        const trend = await this._model.aggregate([
            {
                $match: filter
            },
            {
                $group: {
                    _id: {
                        plan: "$planId",
                        type: "$ownerType"
                    },
                    revenue: { $sum: "$amount"}
                }
            },
            {
                $lookup: {
                    from: 'subscriptionplans',
                    foreignField: "_id",
                    localField: "_id.plan",
                    as: 'Plan'
                }
            }, 
            {
                $unwind: "$Plan"
            },
            {
                $project: {
                    _id: 0,
                    plan: "$Plan.planName",
                    type: "$_id.type",
                    revenue: 1
                }
            }
        ])

        logger.info({result: trend}, 'from repo')
        return trend
    }
    protected mapToEntity(doc: IPayment): PaymentEntity {
        return PaymentMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: PaymentEntity): Partial<IPayment> {
        return PaymentMapper.toDocument(entity)
    }
}