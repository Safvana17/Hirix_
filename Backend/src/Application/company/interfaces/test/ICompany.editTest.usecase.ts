import { CompanyEditTestInputDTO, CompanyEditTestOutputDTO } from "../../dtos/test/company.editTest.dto";

export interface ICompanyEditTestUsecase {
    execute(request: CompanyEditTestInputDTO): Promise<CompanyEditTestOutputDTO>
}