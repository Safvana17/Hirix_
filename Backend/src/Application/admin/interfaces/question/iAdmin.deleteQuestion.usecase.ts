import { AdminDeleteQuestionInputDTO, AdminDeleteQuestionOutputDTO } from "../../dtos/question/admin.deleteQuestion.dto";

export interface IAdminDeleteQuestionUsecase {
    execute(request: AdminDeleteQuestionInputDTO): Promise<AdminDeleteQuestionOutputDTO>
}