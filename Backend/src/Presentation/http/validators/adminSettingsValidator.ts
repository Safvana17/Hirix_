import { z } from 'zod'

export const TemplateSchema = z.object({
  key: z.string().min(3).max(100),
  name: z.string().min(3).max(100),
  channel: z.enum(['EMAIL', 'IN_APP']),
  subject: z.string().min(1).optional(),
  title: z.string().optional(),
  body: z.string().min(1),
  footerText: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().optional(),
  showOtpBox: z.boolean().optional(),
  otpLabel: z.string().optional(),
  expiryText: z.string().optional(),
  supportText: z.string().optional(),
});

export const getAllTemplateQSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().optional(),
  isActive: z.boolean().optional()
})
export type GetAllTemplateQuery = z.infer< typeof getAllTemplateQSchema>

export const CreateNotificationRuleSchema = z.object({
  event: z.string().min(1),
  channel: z.enum(['EMAIL', 'IN_APP']),
  templateKey: z.string().min(1),
  isActive: z.boolean().optional()
})

export const UpdateNotificationRuleSchema = z.object({
  templateKey: z.string().min(1).optional(),
  channel: z.enum(['EMAIL', 'IN_APP']),
  isActive: z.boolean().optional()
})