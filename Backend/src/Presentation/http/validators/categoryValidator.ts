import { z } from 'zod'

export const addCategorySchema = z.object({
    name: z
       .string()
       .trim()
       .min(2, 'Name must be atleast 2 characters')
       .regex(/^[A-Za-z]+( [A-Za-z]+)*$/),
    parent: z
       .string()
       .optional()
})