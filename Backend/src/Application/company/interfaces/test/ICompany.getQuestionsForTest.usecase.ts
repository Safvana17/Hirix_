import { CompanyGetAllQuestionsForTestInputDTO, CompanyGetAllQuestionsForTestOutputDTO } from "../../dtos/test/company.getTestQuestions.dto";

export interface ICompanyGetQuestionsForTest {
    execute(request: CompanyGetAllQuestionsForTestInputDTO): Promise<CompanyGetAllQuestionsForTestOutputDTO>
}