import QuestionType from "../../../../Domain/enums/questionType";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminCreateQuestionInputDTO, AdminCreateQuestionOutputDTO } from "../../dtos/question/admin.createQuestion.dto";
import { IAdminCreateQuestionUsecase } from "../../interfaces/question/iAdminCreateQuestionUsecase";
import { QuestionEntity } from "../../../../Domain/entities/Question.entity";
import QuestionVisibility from "../../../../Domain/enums/questionVisibility";

export class AdminCreateQuestionUsecase implements IAdminCreateQuestionUsecase {
    constructor(
        private _questionRepository: IQuestionRepository,
        private _categoryRepository: ICategoryRepository
    ) {}

    async execute(request: AdminCreateQuestionInputDTO): Promise<AdminCreateQuestionOutputDTO> {
        if(request.createdBy !== userRole.Admin){
            if(request.isPremium){
                throw new AppError(questionMessages.error.COMPANY_CANNOT_CREATE_PREMIUM_QUESTION, statusCode.BAD_REQUEST)
            }
        }

        const existing = await this._questionRepository.findByTitle(request.title)
        if(existing){
            throw new AppError(questionMessages.error.ALREADY_EXIST, statusCode.CONFLICT)
        }

        const categoryExists = await this._categoryRepository.exists(request.categoryId)
        if(!categoryExists){
            throw new AppError(questionMessages.error.CATEGORY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(request.type === QuestionType.MCQ){
            if(!request.options || request.options.length < 2){
                throw new AppError(questionMessages.error.INSUFFICIENT_OPTIONS, statusCode.BAD_REQUEST)
            }
        }

        if(request.type === QuestionType.CODING) {
            if(!request.testCases || request.testCases.length === 0){
                throw new AppError(questionMessages.error.REQUIRED_TEST_CASES, statusCode.BAD_REQUEST)
            }
            request.testCases.forEach(tc => {
                if(!tc.input || !tc.expectedOutput) {
                    throw new AppError(questionMessages.error.INVALID_TESTCASE, statusCode.BAD_REQUEST)
                }
            })
        }

        let visibility = request.isPremium ? QuestionVisibility.PRO : QuestionVisibility.FREE

        const question = new QuestionEntity(
            "",
            request.title,
            request.description,
            request.type,
            request.difficulty,
            request.categoryId,
            request.createdBy,
            visibility,
            request.isPremium,
            request.isPractice,
            false,
            request.answer,
            request.options,
            request.testCases
        )

        await this._questionRepository.create(question)
        return {
            id: question.id,
            isPractice: question.isPractice,
            isPremium: question.isPremium,
            visibility: question.visibility
        }

    }
}