import { z } from 'zod'

export const CreateTemplateSchema = z.object({
  key: z.string().min(3).max(100),
  name: z.string().min(3).max(100),
  channel: z.enum(['EMAIL', 'IN_APP']),
  subject: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  body: z.string().min(1),
})

export const getAllTemplateQSchema = z.object({
  page: z.coerce.number(),
  limit: z.coerce.number(),
  isActive: z.boolean().optional()
})

export type GetAllTemplateQuery = z.infer< typeof getAllTemplateQSchema>