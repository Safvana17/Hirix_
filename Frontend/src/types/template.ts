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

export interface TemplatePayload {
    id: string
    key: string
    name: string;
    channel: TemplateChannel;
    subject?: string | null;
    title?: string | null;
    body: string
}

// export interface editTemplatePayload {
//     id: string;
//     name: string;
//     subject?: string | null;
//     title?: string | null;
//     body: string
// }

export interface GetAllTemplatesArgs {
    isActive?: boolean
    page: number
    limit: number
}

export interface GetAllTemplatesResponse {
    templates: EmailTemplate[]
    totalPages: number
    totalCount: number
}