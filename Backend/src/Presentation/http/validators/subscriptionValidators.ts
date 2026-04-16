import z from "zod";
import { TargetType } from "../../../Domain/enums/subscription";

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