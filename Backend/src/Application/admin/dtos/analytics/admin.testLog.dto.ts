export interface AdminTestLogInputDTO{
    page: number
    limit: number
}

export interface TestLogDTO{
    company: string
    testName: string
    date: string
    candidates: number
    passRate: number
    averageScore: number
}

export interface AdminTestLogOutputDTO {
    test: TestLogDTO[]
    totalCount: number
    totalPages: number
}