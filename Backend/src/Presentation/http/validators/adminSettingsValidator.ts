import { z } from 'zod'
import { NotificationChannels, TemplateStatus } from '../../../Domain/enums/notification';

export const TemplateSchema = z.object({
  key: z.string().min(3).max(100),
  name: z.string().min(3).max(100),
  channel: z.enum(['EMAIL', 'IN_APP']),
  subject: z.string().optional(),
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
  isActive: z.boolean().optional()
})

export const UpdatetEmplateStatusSchema = z.object({
  status: z.nativeEnum(TemplateStatus)
})
export const settingsParamsShema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/)
})
export type templateParams = z.infer<typeof settingsParamsShema>

export const getAllRulesSchema = z.object({
  search: z.string().optional(),
  channel: z.nativeEnum(NotificationChannels).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number(),
})
export type getAllRulesQuery = z.infer<typeof getAllRulesSchema>