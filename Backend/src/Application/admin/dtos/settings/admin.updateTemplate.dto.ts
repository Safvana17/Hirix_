export interface AdminUpdateTemplateInputDTO {
    id: string
    status: 'Activate' | 'Deactivate'
}

export interface AdminUpdateTemplateOutputDTO {
    id: string
}