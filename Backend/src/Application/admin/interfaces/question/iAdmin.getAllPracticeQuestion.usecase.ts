import { getAllPracticeQuestionsInputDTO, PaginatedPracticeQuestionDTO } from "../../dtos/question/admin.getAllPracticeQuesions.dto";

export interface IAdminGetAllPracticeQuestionsUsecase {
    execute(request: getAllPracticeQuestionsInputDTO): Promise<PaginatedPracticeQuestionDTO>
}