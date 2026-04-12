import { SubscriptionPlanMapper } from "../../Application/Mappers/mapper.subscriptionPlan";
import { SubscriptionPlanEntity } from "../../Domain/entities/SubscriptionPlan.entity";
import { TargetType } from "../../Domain/enums/subscription";
import { ISubscriptionPlanRepository } from "../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { ISubscriptionPlan, SubscriptionPlanModel } from "../database/Model/SubscriptionPlan";
import { BaseRepository } from "./base.repository";

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

    protected mapToEntity(doc: ISubscriptionPlan): SubscriptionPlanEntity {
        return SubscriptionPlanMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: SubscriptionPlanEntity): Partial<ISubscriptionPlan> {
        return SubscriptionPlanMapper.toDocument(entity)
    }
}