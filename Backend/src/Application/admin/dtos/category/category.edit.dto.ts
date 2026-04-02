export interface AdminEditCategoryInputDTO{
    id: string
    name: string
    parentId: string | null
}

export interface AdminEditCategoryOutputDTO {
    id: string
    name: string
    parentId: string | null
    isDeleted: boolean
}