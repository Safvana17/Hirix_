import z from "zod";

export const CategorySchema = z.object({
    name: z
       .string()
       .trim()
       .min(2, 'Name must be atleast 2 characters')
       .regex(/^[A-Za-z0-9.+#\-/ ]+$/, 'Name contains invalid characters'),
    parentId: z
       .string()
       .nullable()
       .optional()
})