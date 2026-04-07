import { CompanyEditQuestionInputDTO, CompanyEditQuestionOutputDTO } from "../../dtos/question/company.editQuestion.dto";

export interface ICompanyEditQuestionUsecase {
    execute(request: CompanyEditQuestionInputDTO): Promise<CompanyEditQuestionOutputDTO>
}