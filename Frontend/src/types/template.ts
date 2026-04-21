export type TemplateChannel = 'EMAIL' | 'IN_APP'

export interface EmailTemplate {
    id: string
    key: string;
    name: string;
    channel: TemplateChannel;
    subject: string | null;
    title: string | null;
    body: string;
    isActive: boolean;
    isDeleted: boolean;
}

export interface CreateTemplatePayload {
    key: string
    name: string;
    channel: TemplateChannel;
    subject?: string | null;
    title?: string | null;
    body: string
    isActive?: boolean
}