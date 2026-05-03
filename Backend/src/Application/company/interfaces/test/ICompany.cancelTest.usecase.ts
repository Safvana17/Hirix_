import { CompanyCancelTestInputDTO, CompanyCancelTestOutputDTO } from "../../dtos/test/company.cancelTest.dto";

export interface ICompanyCancelTestUsecase {
    execute(request: CompanyCancelTestInputDTO): Promise<CompanyCancelTestOutputDTO>
}