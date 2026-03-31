export interface Category {
    id: string
    name: string
    parentId: string | null
    isDeleted: boolean
}

export interface createCategoryPayload {
    name: string
    parentId: string | null
}

export type ModalMode = 'create' | 'edit'