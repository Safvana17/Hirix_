import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { getAllQuestionsInputDTO, PaginatedQuestionDTO } from "../../dtos/question/admin.getAllQuestions.dto";
import { IAdminGetAllQuestionUsecase } from "../../interfaces/question/iAdmin.getAllQuestions.usecase";

export class AdminGetAllQuestionsUsecase implements IAdminGetAllQuestionUsecase {
    constructor(
        private _questionRepository: IQuestionRepository
    ) {}

    async execute(request: getAllQuestionsInputDTO): Promise<PaginatedQuestionDTO> {
        const {data, totalCount, totalPages} = await this._questionRepository.findAllFiltered(request)
        return {
            questions: data.map(q => ({
                id: q.id,
                title: q.title,
                categoryName: q.categoryName!,
                type: q.type,
                difficulty: q.difficulty,
                visibility: q.visibility
            })),
            totalCount,
            totalPages
        }
    }
}