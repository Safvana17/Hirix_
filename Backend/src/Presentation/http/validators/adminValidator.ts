import { z } from 'zod'
import { userStatus } from '../../../Domain/enums/userStatus.enum'


export const QuerySchema = z.object({
    search: z.string().optional(),
    status: z.nativeEnum(userStatus).optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(1)
})

export const updateStatusSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    status: z.nativeEnum(userStatus)
})