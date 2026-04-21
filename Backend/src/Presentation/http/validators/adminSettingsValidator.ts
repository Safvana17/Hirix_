import { z } from 'zod'

export const TemplateSchema = z.object({
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

export const CreateNotificationRuleSchema = z.object({
  event: z.string().min(1),
  channel: z.enum(['EMAIL', 'IN_APP']),
  templateKey: z.string().min(1),
  isActive: z.boolean().optional()
})