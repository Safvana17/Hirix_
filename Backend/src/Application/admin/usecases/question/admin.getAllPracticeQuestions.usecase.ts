import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { getAllPracticeQuestionsInputDTO, PaginatedPracticeQuestionDTO } from "../../dtos/question/admin.getAllPracticeQuesions.dto";
import { IAdminGetAllPracticeQuestionsUsecase } from "../../interfaces/question/iAdmin.getAllPracticeQuestion.usecase";

export class AdminGetAllPracticeQuestionUsecase implements IAdminGetAllPracticeQuestionsUsecase {
    constructor (
        private _questionRepository: IQuestionRepository
    ) {}

    async execute(request: getAllPracticeQuestionsInputDTO): Promise<PaginatedPracticeQuestionDTO> {
        const {data, totalCount, totalPages} = await this._questionRepository.findAllPracticeQuestions(request)
        return {
            practiceQuestions: data,
            totalPages,
            totalCount
        }
    }
}