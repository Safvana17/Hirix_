import { QuestionEntity } from "../../../../Domain/entities/Question.entity";
import QuestionType from "../../../../Domain/enums/questionType";
import QuestionVisibility from "../../../../Domain/enums/questionVisibility";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import { ICategoryRepository } from "../../../../Domain/repositoryInterface/iCategory.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyCreateQuestionInputDTO, CompanyCreateQuestionOutputDTO } from "../../dtos/question/company.createQuestion.dto";
import { ICompanyCreateQuestionUsecase } from "../../interfaces/question/iCompany.createQuestion.usecase";

export class CompanyCreateQuestionUsecase implements ICompanyCreateQuestionUsecase {
    constructor(
        private _questionRepository: IQuestionRepository,
        private _categoryRepository: ICategoryRepository
    ) {}
    async execute(request: CompanyCreateQuestionInputDTO): Promise<CompanyCreateQuestionOutputDTO> {
        if(request.isPremium && request.user.role === userRole.Company){
            throw new AppError(questionMessages.error.COMPANY_CANNOT_CREATE_PREMIUM_QUESTION, statusCode.BAD_REQUEST)
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
            if(request.answer === undefined || request.answer === null ){
                throw new AppError(questionMessages.error.ANSWER_REQUIRED, statusCode.BAD_REQUEST)
            }
            if(!request.options || request.options.length < 2){
                throw new AppError(questionMessages.error.INSUFFICIENT_OPTIONS, statusCode.BAD_REQUEST)
            }

            const options = request.options.map(opt => opt.trim())
            if(options.some(opt => opt === "")){
                throw new AppError(questionMessages.error.EMPTY_OPTION, statusCode.BAD_REQUEST)
            }

            const uniqueOptions = new Set(options)
            if(uniqueOptions.size !== options.length){
                throw new AppError(questionMessages.error.DUPLICATE_OPTION, statusCode.BAD_REQUEST)
            }

            if(!request.options.includes(request.answer)){
                throw new AppError(questionMessages.error.INCORRECT_ANSWER, statusCode.BAD_REQUEST)
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

        let visibility = QuestionVisibility.FREE

        const question = new QuestionEntity(
            "",
            request.title,
            request.description,
            request.type,
            request.difficulty,
            request.categoryId,
            request.user.role,
            visibility,
            request.isPremium,
            request.isPractice,
            false,
            request.answer,
            request.options,
            request.testCases
        )

        question.createdById = request.user.id
        await this._questionRepository.create(question)
        return {
            id: question.id,
            isPractice: question.isPractice,
            isPremium: question.isPremium,
            visibility: question.visibility
        }
    }
}