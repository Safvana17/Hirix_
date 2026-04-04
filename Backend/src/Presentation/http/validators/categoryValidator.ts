import { z } from 'zod'

export const addCategorySchema = z.object({
    name: z
       .string()
       .trim()
       .min(2, 'Name must be atleast 2 characters')
       .regex(/^[A-Za-z0-9.+#\-/ ]+$/),
    parentId: z
       .string()
       .nullable()
       .optional()
})

export const CategoryQuerySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(1)
})

export const deleteCategorySchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/)
})

export const editCategorySchema = z.object({
    name: z
       .string()
       .trim()
       .min(2, 'Name must be atleast 2 characters')
       .regex(/^[A-Za-z0-9.+#\-/ ]+$/),
    parentId: z
       .string()
       .nullable()
})
export const getAllCategorySchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().optional()
})