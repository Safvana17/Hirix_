import { Types } from "mongoose";
import { PaymentEntity } from "../../Domain/entities/Payment.entity";
import { IPayment } from "../../Infrastructure/database/Model/Payment";

export class PaymentMapper {
    static toEntity(doc: IPayment): PaymentEntity {
        const payment = new PaymentEntity(
            doc._id.toString(),
            doc.subscriptionId.toString(),
            doc.ownerType,
            doc.ownerId.toString(),
            doc.planId.toString(),
            doc.amount,
            doc.currency,
            doc.status,
            doc.orderId,
            doc.paymentId,
            doc.signature,
            doc.description,
            doc.invoiceUrl,
            doc.paymentDate
        )

        payment.failureRason = doc.failureReason

        return payment
    }

    static toDocument(entity: PaymentEntity){
        return {
            subscriptionId: new Types.ObjectId(entity.subscriptionId),
            ownerType: entity.ownerType,
            ownerId: new Types.ObjectId(entity.ownerId),
            planId: new Types.ObjectId(entity.planId),
            amount: entity.amount,
            currency: entity.currency,
            status: entity.status,
            orderId: entity.orderId,
            paymentId: entity.paymentId,
            signature: entity.signature,
            description: entity.description,
            invoiceUrl: entity.invoiceUrl,
            paymentDate: entity.paymentDate,
            failureReason: entity.failureRason
        }
    }
}