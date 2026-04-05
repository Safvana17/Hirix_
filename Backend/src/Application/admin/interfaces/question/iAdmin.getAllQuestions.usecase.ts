import { getAllQuestionsInputDTO, PaginatedQuestionDTO } from "../../dtos/question/admin.getAllQuestions.dto";

export interface IAdminGetAllQuestionUsecase {
    execute(request: getAllQuestionsInputDTO): Promise<PaginatedQuestionDTO>
}