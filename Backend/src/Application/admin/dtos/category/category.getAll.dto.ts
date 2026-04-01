

export interface GetAllCategoryOutputDTO {
    categories: {
        id: string;
        name: string;
        parentId: string | null;
        isDeleted: boolean
    }[]
}

// export interface PaginatedCategoryDTO {
//     categories: GetAllCategoryOutputDTO[];
//     totalPages: number;
//     totalCount: number
// }