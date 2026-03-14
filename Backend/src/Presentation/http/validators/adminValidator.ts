import { z } from 'zod'
import { UserStatus } from '../../../Domain/enums/userStatus.enum'


export const QuerySchema = z.object({
    search: z.string().optional(),
    status: z.nativeEnum(UserStatus).optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(1)
})

export const updateStatusSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    status: z.nativeEnum(UserStatus)
})

export const approveCompanySchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
})

export const rejectCompanySchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    reason: z.string()
})