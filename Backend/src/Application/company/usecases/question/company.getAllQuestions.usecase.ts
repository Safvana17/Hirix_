import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { CompanyGetAllQuestionsInputDTO, CompanyPaginatedQuestionDTO } from "../../dtos/question/company.getAllQuestions.dto";
import { ICompanyGetAllQuestionsUsecase } from "../../interfaces/question/iCompany.getAllQuestions.usecase";

export class CompanyGetAllQuestionsUsecase implements ICompanyGetAllQuestionsUsecase {
    constructor (
        private _questionRepository :IQuestionRepository
    ) {}

    async execute(request: CompanyGetAllQuestionsInputDTO): Promise<CompanyPaginatedQuestionDTO> {
        const {data, totalCount, totalPages} = await this._questionRepository.findAllFiltered(request)
        return {
            questions: data,
            totalCount,
            totalPages
        }
    }
}