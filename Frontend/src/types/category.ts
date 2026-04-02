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

export type getAllCategoryParams = {
  page?: number
  limit?: number
}

export interface deleteCategoryResponse {
    id: string
}
export interface GetAllCategoryResponse{
    categories: Category[]
    totalPages: number
    totalCount: number
}

export interface CategoryNode extends Category {
    children: CategoryNode[]
}
