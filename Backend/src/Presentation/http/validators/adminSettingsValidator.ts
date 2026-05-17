import { z } from 'zod'
import { NotificationChannels, TemplateStatus } from '../../../Domain/enums/notification';


export const TemplateFieldOptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const ButtonValueSchema = z.object({
  text: z.string(),
  url: z.string(),
});

export const TemplateFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum([
    "text",
    "textarea",
    "number",
    "dropdown",
    "checkbox",
    "button",
  ]),

  purpose: z.enum([
    "SUBJECT",
    "TITLE",
    "BODY",
    "FOOTER",
    "CTA_BUTTON",
    "OTP_LABEL",
    "OTP_CODE",
    "EXPIRY_TEXT",
    "SUPPORT_TEXT",
    "CUSTOM",
  ]),

  required: z.boolean(),

  placeholder: z.string().optional(),

  order: z.number(),

  options: z.array(TemplateFieldOptionSchema).optional(),
});

export const TemplateValuesSchema = z.record(
  z.string(),
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    ButtonValueSchema,
  ])
)

export const TemplateSchema = z.object({
  key: z.string().min(3).max(100),

  name: z.string().min(3).max(100),

  channel: z.enum(["EMAIL", "IN_APP"]),

  fields: z.array(TemplateFieldSchema),

  values: TemplateValuesSchema,

  isActive: z.boolean().optional(),
});

export const getAllTemplateQSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().optional(),
  search: z.string().optional(),
  channel: z.nativeEnum(NotificationChannels).optional(),
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