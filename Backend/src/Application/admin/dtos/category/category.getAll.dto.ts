

export interface GetAllCategoryOutputDTO {
    id: string;
    name: string;
    parentId: string | null;
    isDeleted: boolean
}

export interface getAllCategoryInputDTO{
    page?: number;
    limit?: number
}

export interface PaginatedCategoryDTO {
    categories: GetAllCategoryOutputDTO[];
    totalPages: number;
    totalCount: number
}