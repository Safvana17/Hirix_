import { TestStatus } from "../../../../Domain/enums/Test"

export interface CompanyGetAllTestInputDTO {
    companyId: string
    search?: string
    status?: TestStatus
    page: number
    limit: number
}


export interface CompanyTestListDTO{
    id: string
    name: string
    jobRole: string
    startTime: Date
    endTime: Date
    durationInMinutes: number
    testStatus: TestStatus
    candidatesCount: number
    isDeleted: boolean
}
export interface CompanyGetAllTestOututDTO {
    tests: CompanyTestListDTO[]
    totalPages: number
    totalCount: number
    featureLocked: boolean
}