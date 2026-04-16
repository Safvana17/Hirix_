import { PaymentMapper } from "../../Application/Mappers/mapper.payment";
import { PaymentEntity } from "../../Domain/entities/Payment.entity";
import { IPaymentRepository } from "../../Domain/repositoryInterface/iPayment.repository";
import { IPayment, PaymentModel } from "../database/Model/Payment";
import { BaseRepository } from "./base.repository";

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

    protected mapToEntity(doc: IPayment): PaymentEntity {
        return PaymentMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: PaymentEntity): Partial<IPayment> {
        return PaymentMapper.toDocument(entity)
    }
}