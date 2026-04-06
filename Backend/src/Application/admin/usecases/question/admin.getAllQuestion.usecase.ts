import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { logger } from "../../../../utils/logging/loger";
import { getAllQuestionsInputDTO, PaginatedQuestionDTO } from "../../dtos/question/admin.getAllQuestions.dto";
import { IAdminGetAllQuestionUsecase } from "../../interfaces/question/iAdmin.getAllQuestions.usecase";

export class AdminGetAllQuestionsUsecase implements IAdminGetAllQuestionUsecase {
    constructor(
        private _questionRepository: IQuestionRepository
    ) {}

    async execute(request: getAllQuestionsInputDTO): Promise<PaginatedQuestionDTO> {
        const {data, totalCount, totalPages} = await this._questionRepository.findAllFiltered(request)
        logger.info(data, 'from usecase')
        return {
            questions: data,
            totalCount,
            totalPages
        }
    }
}