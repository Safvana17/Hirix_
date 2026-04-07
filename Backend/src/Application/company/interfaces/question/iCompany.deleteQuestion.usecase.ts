import { CompanyDeleteQuestionInputDTO, CompanyDeleteQuestionOutputDTO } from "../../dtos/question/company.deleteQuestion.dto";

export interface ICompanyDeleteQuestionUsecase{
    execute(request: CompanyDeleteQuestionInputDTO): Promise<CompanyDeleteQuestionOutputDTO>
}