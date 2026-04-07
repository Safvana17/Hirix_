import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyDeleteQuestionInputDTO, CompanyDeleteQuestionOutputDTO } from "../../dtos/question/company.deleteQuestion.dto";
import { ICompanyDeleteQuestionUsecase } from "../../interfaces/question/iCompany.deleteQuestion.usecase";

export class CompanyDeleteQuestionUsecase implements ICompanyDeleteQuestionUsecase{
    constructor(
        private _questionRepository: IQuestionRepository
    ) {}

    async execute(request: CompanyDeleteQuestionInputDTO): Promise<CompanyDeleteQuestionOutputDTO> {
        const question = await this._questionRepository.findById(request.id)
        if(!question){
            throw new AppError(questionMessages.error.QUESTION_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(question.createdBy !== userRole.Company && question.createdById !== request.user.id){
            throw new AppError(questionMessages.error.COMPANY_CANNOT_DELETE_OTHER_QUESTION, statusCode.BAD_REQUEST)
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