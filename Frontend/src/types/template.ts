import type { NotificationChannel } from "./notification";

export type TemplateChannel = 'EMAIL' | 'IN_APP'
export type TemplateFieldType = "text" | "textarea" | "number" | "dropdown" | "checkbox" | "button";
export type TemplateFieldPurpose = "SUBJECT" | "TITLE" | "BODY" | "FOOTER" | "CTA_BUTTON" | "OTP_LABEL" | "OTP_CODE" | "EXPIRY_TEXT" | "SUPPORT_TEXT" | "CUSTOM";
export interface TemplateFieldOption {
  label: string;
  value: string;
}

export interface TemplateField {
  id?: string;
  name: string;
  label: string;
  type: TemplateFieldType;
  required: boolean;
  placeholder?: string;
  order: number;
  purpose?: TemplateFieldPurpose
  options?: TemplateFieldOption[];
}

export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  channel: TemplateChannel;
  fields: TemplateField[];
  values: Record<string, unknown>;
  isActive: boolean;
  isDeleted: boolean;
}

export interface TemplatePayload {
  id?: string;
  key: string;
  name: string;
  channel: TemplateChannel;
  fields: TemplateField[];
  values: Record<string, unknown>;
  isActive: boolean;
}

// export interface editTemplatePayload {
//     id: string;
//     name: string;
//     subject?: string | null;
//     title?: string | null;
//     body: string
// }

export interface GetAllTemplatesArgs {
    search?: string
    channel?: NotificationChannel
    page?: number
    limit?: number
}

export interface GetAllTemplatesResponse {
    templates: EmailTemplate[]
    totalPages: number
    totalCount: number
}

export interface UpdateTemplateStatusPayload {
    id: string
    status: 'Activate' | 'Deactivate'
}