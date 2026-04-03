import { AdminCreateQuestionInputDTO, AdminCreateQuestionOutputDTO } from "../../dtos/question/admin.createQuestion.dto";

export interface IAdminCreateQuestionUsecase {
    execute(request: AdminCreateQuestionInputDTO): Promise<AdminCreateQuestionOutputDTO>
}