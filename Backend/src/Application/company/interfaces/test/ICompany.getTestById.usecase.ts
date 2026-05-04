import { CompanyGetTestByIDInputDTO, CompanyGetTestByIDOutputDTO } from "../../dtos/test/company.getTestById.dto";

export interface ICompanyGetTestByIDUsecase {
    execute(request: CompanyGetTestByIDInputDTO): Promise<CompanyGetTestByIDOutputDTO>
}