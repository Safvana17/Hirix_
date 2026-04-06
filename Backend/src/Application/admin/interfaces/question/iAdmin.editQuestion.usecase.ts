import { AdminEditQuestionInputDTO, AdminEditQuestionOutputDTO } from "../../dtos/question/admin.editQuestion.dto";

export interface IAdminEditQuestionUsecase {
    execute(request: AdminEditQuestionInputDTO): Promise<AdminEditQuestionOutputDTO>
}