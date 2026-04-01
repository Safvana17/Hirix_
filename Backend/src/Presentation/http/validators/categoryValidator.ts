import { z } from 'zod'

export const addCategorySchema = z.object({
    name: z
       .string()
       .trim()
       .min(2, 'Name must be atleast 2 characters')
       .regex(/^[A-Za-z0-9.+#\-/ ]+$/),
    parentId: z
       .string()
       .optional()
})

export const CategoryQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(1)
})