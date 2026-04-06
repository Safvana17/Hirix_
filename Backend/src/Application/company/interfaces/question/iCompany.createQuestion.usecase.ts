import { CompanyCreateQuestionInputDTO, CompanyCreateQuestionOutputDTO } from "../../dtos/question/company.createQuestion.dto";

export interface ICompanyCreateQuestionUsecase {
    execute(request: CompanyCreateQuestionInputDTO): Promise<CompanyCreateQuestionOutputDTO>
}