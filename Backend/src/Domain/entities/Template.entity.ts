import { NotificationChannel, TemplateFieldPurpose, TemplateFieldType } from "../enums/notification";


export interface TemplateFieldOption {
    label: string
    value: string
}

export interface TemplateField {
    id: string
    name: string
    label: string
    type: TemplateFieldType
    required: boolean
    placeHolder?: string
    purpose?: TemplateFieldPurpose
    order: number
    options?: TemplateFieldOption[]
}
export class TemplateEntity {
    id: string;
    key: string;
    name: string;
    channel: NotificationChannel;
    fields: TemplateField[]
    values: Record<string, unknown>
    isActive: boolean;
    isDeleted: boolean;

    constructor(id: string, key: string, name: string, channel: NotificationChannel, fields: TemplateField[], values: Record<string, unknown>, isActive: boolean, isDeleted: boolean) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.channel = channel;
        this.fields = fields;
        this.values = values
        this.isActive = isActive;
        this.isDeleted = isDeleted
    }
}