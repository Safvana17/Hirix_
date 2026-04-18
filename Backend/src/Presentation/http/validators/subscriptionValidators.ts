import z from "zod";
import { TargetType } from "../../../Domain/enums/subscription";
import { PaymentStatus } from "../../../Domain/enums/payment";

export const UserPlanQuerySchema = z.object({
  target: z
    .nativeEnum(TargetType),
  page: z
    .coerce.number()
    .default(1),
  limit: z
    .coerce.number()
    .default(10),
})

export const ChangeSubscriptionSchema = z.object({
  planId: z.string().regex(/^[0-9a-fA-F]{24}$/)
})
export const MakePaymentSchema = z.object({
  planId: z.string().regex(/^[0-9a-fA-F]{24}$/)
})

export const ConfirmPaymnetSchema = z.object({
  planId: z.string().regex(/^[0-9a-fA-F]{24}$/),
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string()
})

export const MarkFailureSchema = z.object({
  orderId: z.string()
})

export const PaymnetQuerySchema = z.object({
    status: z.nativeEnum(PaymentStatus).optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10)
})
export type PaymentQuery = z.infer<typeof PaymnetQuerySchema>

export const CancelSubscriptionSchema = z.object({
  id: z.string()
})
export type CancelSubscriptionParam = z.infer<typeof CancelSubscriptionSchema>


export const GetInvoiceSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/)
})
export type getInvoiceParam = z.infer<typeof GetInvoiceSchema>