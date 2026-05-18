import { CompanyScheduleAgainTestInputDTO, CompanyScheduleAgainTestOutputDTO } from "../../dtos/test/company.testScheduleAgain.dto";

export interface ICompanyScheduleTestAgainUsecase {
    execute(request: CompanyScheduleAgainTestInputDTO): Promise<CompanyScheduleAgainTestOutputDTO>
}