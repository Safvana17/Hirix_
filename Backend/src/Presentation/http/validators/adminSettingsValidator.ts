import { z } from 'zod'

export const CreateTemplateSchema = z.object({
  key: z.string().min(3).max(100),
  name: z.string().min(3).max(100),
  channel: z.enum(['EMAIL', 'IN_APP']),
  subject: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  body: z.string().min(1),
})