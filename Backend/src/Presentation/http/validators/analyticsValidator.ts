import z from "zod";
import { RevenuePeriod } from "../../../Domain/enums/analytics";

export const GetRevenueTRendByMonthSchema = z.object({
    month: z.coerce.number().pipe(z.nativeEnum(RevenuePeriod))
})
export type RevenueTrendByMonthQuery = z.infer<typeof GetRevenueTRendByMonthSchema>