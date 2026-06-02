import { MonthPeriod } from "../../../../Domain/enums/analytics";

export interface AdminTestActivityInputDTO {
    month: MonthPeriod
}

export interface TestActivityDTO{
    month: string
    test: number
    candidate: number
}
export interface AdminTestActivityOutputDTO {
    activity: TestActivityDTO[]
}