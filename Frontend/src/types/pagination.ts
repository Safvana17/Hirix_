export interface Pagination {
    currentPage: number
    totalPages: number
    totalCount: number
    onPageChange: (page: number) => void
    pageSize?: number
    onPageSizeChange?: (size: number) => void
}