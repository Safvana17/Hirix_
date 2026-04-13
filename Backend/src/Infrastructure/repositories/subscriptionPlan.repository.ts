import { QueryFilter } from "mongoose";
import { SubscriptionPlanMapper } from "../../Application/Mappers/mapper.subscriptionPlan";
import { SubscriptionPlanEntity } from "../../Domain/entities/SubscriptionPlan.entity";
import { TargetType } from "../../Domain/enums/subscription";
import { ISubscriptionPlanRepository } from "../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { ISubscriptionPlan, SubscriptionPlanModel } from "../database/Model/SubscriptionPlan";
import { BaseRepository } from "./base.repository";
import { logger } from "../../utils/logging/loger";

export class SubscriptionPlanRepository extends BaseRepository<SubscriptionPlanEntity, ISubscriptionPlan> implements ISubscriptionPlanRepository{
    constructor(){
        super(SubscriptionPlanModel)
    }

    async findByNameAndTarget(name: string, target: TargetType): Promise<SubscriptionPlanEntity | null> {
        const document = await this._model.findOne({
            planName: name,
            target: target
        })
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findAllFiltered(query: {target?: TargetType, page: number, limit: number}): Promise<{ data: SubscriptionPlanEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<ISubscriptionPlan> = {
            isDeleted: false
        }
        if(query.target){
            filter.target = query.target
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount / query.limit)

        const documnet = await this._model
                .find(filter)
                .skip(skip)
                .limit(query.limit)
                .sort({createdAt: -1})

        logger.info(documnet, 'from repository')

        return {
            data: documnet.map(d => this.mapToEntity(d)),
            totalCount,
            totalPages
        }
    }

    protected mapToEntity(doc: ISubscriptionPlan): SubscriptionPlanEntity {
        return SubscriptionPlanMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: SubscriptionPlanEntity): Partial<ISubscriptionPlan> {
        return SubscriptionPlanMapper.toDocument(entity)
    }
}