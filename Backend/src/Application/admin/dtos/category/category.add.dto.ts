export interface AdminAddCategoryInputDTO {
    name: string;
    parentId?: string | null
}


export interface AdminAddCategoryOutputDTO{
    id: string;
    name: string
    haveParent: boolean
}