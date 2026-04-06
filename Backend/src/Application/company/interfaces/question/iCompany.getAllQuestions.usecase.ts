import { CompanyGetAllQuestionsInputDTO, CompanyPaginatedQuestionDTO } from "../../dtos/question/company.getAllQuestions.dto";

export interface ICompanyGetAllQuestionsUsecase {
    execute(request: CompanyGetAllQuestionsInputDTO): Promise<CompanyPaginatedQuestionDTO>
}