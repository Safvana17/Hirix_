import { AppError } from "../../../../Domain/errors/app.error";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminDeleteQuestionInputDTO, AdminDeleteQuestionOutputDTO } from "../../dtos/question/admin.deleteQuestion.dto";
import { IAdminDeleteQuestionUsecase } from "../../interfaces/question/iAdmin.deleteQuestion.usecase";

export class AdminDeleteQuestionUsecase implements IAdminDeleteQuestionUsecase {
    constructor (
        private _questionRepository: IQuestionRepository
    ) {}

    async execute(request: AdminDeleteQuestionInputDTO): Promise<AdminDeleteQuestionOutputDTO> {
        const question = await this._questionRepository.findById(request.id)
        if(!question){
            throw new AppError(questionMessages.error.QUESTION_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(question.isDeleted){
            throw new AppError(questionMessages.error.DELETED_QUESTION, statusCode.BAD_REQUEST)
        }
        question.isDeleted = true
        await this._questionRepository.update(question.id, question)
        return {
            id: question.id
        }
    }
}