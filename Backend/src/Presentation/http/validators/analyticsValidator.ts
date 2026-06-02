import z from "zod";
import { RevenuePeriod } from "../../../Domain/enums/analytics";
import { TargetType } from "../../../Domain/enums/subscription";

export const GetRevenueTrendByMonthSchema = z.object({
    month: z.coerce.number().pipe(z.nativeEnum(RevenuePeriod))
})
export type RevenueTrendByMonthQuery = z.infer<typeof GetRevenueTrendByMonthSchema>

export const GetRevenueTrendByPlanSchema = z.object({
    type: z.nativeEnum(TargetType).optional()
})
export type RevenueTrendByPlanQuery = z.infer<typeof GetRevenueTrendByPlanSchema>

export const GetPaymentHistorySchema = z.object({
    page: z.coerce.number(),
    limit: z.coerce.number()
})
export type PaymentHistoryQuery = z.infer<typeof GetPaymentHistorySchema>